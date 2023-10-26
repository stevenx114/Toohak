import {
    getData,
    setData,
    Quiz
  } from './dataStore';

  import validator from 'validator';
  
  import {
    getUser,
    getQuiz,
    getToken,
    QuizIdReturn,
    ErrorObject,
    QuizListReturn,
    EmptyObject
  } from './types';


/**
 * Get all of the relevant information about the current quiz.
 *
 * @param {String} token
 * @param {Number} quizId
 * @returns {object} Quiz
 */
export const adminQuizInfo = (token: string, quizId: number): Quiz | ErrorObject => {
  const curToken = getToken(token);

  if (!curToken) {
    return {
      error: 'Token does not refer to valid logged in user session',
      statusCode: 401,
    };
  }
  const quiz = getQuiz(quizId);

  const userId = curToken.authUserId;
  const curUser = getUser(userId);
  if (!curUser.quizzesOwned.includes(quizId)) {
    return {
      error: 'Quiz ID does not refer to a quiz that this user owns',
      statusCode: 403,
    };
  }
  return {
    quizId: quiz.quizId,
    name: quiz.name,
    timeCreated: quiz.timeCreated,
    timeLastEdited: quiz.timeLastEdited,
    description: quiz.description,
    numQuestions: quiz.numQuestions,
    questions: quiz.questions
  };
};
