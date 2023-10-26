import {
  getData,
  setData,
} from './dataStore';

import {
  getUser,
  getQuiz,
  getToken,
  getQuestion,
  ErrorObject,
  EmptyObject
} from './types';

export const adminQuizQuestionMove = (token: string, quizId: number, questionId: number, newPosition: number): EmptyObject | ErrorObject => {
  const data = getData();
  const curToken = getToken(token);
  if (!curToken) {
    return {
      error: 'Token does not refer to valid logged in user session',
      statusCode: 401,
    };
  }

  const curUserId = curToken.authUserId;
  const curUser = getUser(curUserId);
  const curQuiz = getQuiz(quizId);
  const curQuestion = getQuestion(quizId, questionId);
  const curQuestions = curQuiz.questions;
  const curQuestionIds = curQuestions.map(q => q.questionId);
  if (!curUser.quizzesOwned.includes(quizId)) {
    return {
      error: 'Quiz ID does not refer to a quiz that this user owns',
      statusCode: 403,
    };
  }

  if (!curQuestionIds.includes(questionId)) {
    return {
      error: 'Question Id does not refer to a valid question within this quiz',
      statusCode: 400,
    };
  }

  if (newPosition < 0 || newPosition > curQuiz.numQuestions - 1) {
    return {
      error: 'NewPosition is less than 0, or NewPosition is greater than n-1 where n is the number of questions',
      statusCode: 400,
    };
  }

  if (newPosition === curQuestionIds.indexOf(questionId)) {
    return {
      error: 'NewPosition is the position of the current question',
      statusCode: 400,
    };
  }

  const initialIndex = curQuestions.indexOf(curQuestion);
  curQuestions.splice(initialIndex, 1);
  curQuestions.splice(newPosition, 0, curQuestion);
  curQuiz.timeLastEdited = Math.floor((new Date()).getTime() / 1000);
  setData(data);

  return {};
};
