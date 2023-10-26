import {
  getData,
  setData,
  Quiz,
  Answer
} from './dataStore';

import { v4 as uuidv4 } from 'uuid';

import validator from 'validator';

import {
  getUser,
  getQuiz,
  QuizIdReturn,
  ErrorObject,
  QuizListReturn,
  EmptyObject,
  questionBody
} from './types';

import { getToken } from './types';

/**
 *
 *
 * Given basic details about a new quiz, create one for the logged in user.
 *
 * @param {number} authUserId
 * @param {string} name
 * @param {string} description
 * @returns {object} quiz info
 */
export const adminQuizCreate = (authUserId: number, name: string, description: string): QuizIdReturn | ErrorObject => {
  const data = getData();
  const specialChar = /[^a-zA-Z0-9\s]/;
  const userId = getUser(authUserId);

  if (!userId) {
    return { error: 'AuthUserId is not a valid user' };
  }

  if (!name) {
    return { error: 'name cannot be empty' };
  } else if (name.length < 3) {
    return { error: 'name needs to be at least 3 characters' };
  } else if (name.length > 30) {
    return { error: 'name cannot exceed 30 characters' };
  } else if (description.length > 100) {
    return { error: 'description cannot exceed 100 characters' };
  } else if (specialChar.test(name)) {
    return { error: 'name can only contain alphanumeric and space characters' };
  }

  for (const id in userId.quizzesOwned) {
    const quizIdOwned = userId.quizzesOwned[id];
    const quizInfo = getQuiz(quizIdOwned);
    if (quizInfo.name === name) {
      return { error: 'quiz name is already in use' };
    }
  }

  const newQuizId = parseInt(uuidv4().replace(/-/g, ''), 16);

  data.quizzes.push(
    {
      quizId: newQuizId,
      name: name,
      timeCreated: Math.floor((new Date()).getTime() / 1000),
      timeLastEdited: Math.floor((new Date()).getTime() / 1000),
      description: description,
    }
  );

  userId.quizzesOwned.push(newQuizId); // Updates the quizzes owned by current user
  setData(data);

  return {
    quizId: newQuizId,
  };
};

/**
 * Given a particular quiz, permanently remove the quiz.
 *
 * @param {number} authUserId of integers
 * @param {number} quizId of integers
 * @returns {object} empty object
 */
export const adminQuizRemove = (authUserId: number, quizId: number): EmptyObject | ErrorObject => {
  const data = getData();
  const user = getUser(authUserId);
  if (!user) {
    return {
      error: 'AuthUserId is not a valid user'
    };
  }
  if (!getQuiz(quizId)) {
    return {
      error: 'Quiz ID does not refer to a valid quiz'
    };
  }
  if (!user.quizzesOwned.includes(quizId)) {
    return {
      error: 'Quiz ID does not refer to a quiz that this user owns'
    };
  }
  const indexOfQuizInData = data.quizzes.findIndex(quiz => quiz.quizId === quizId);
  if (indexOfQuizInData !== -1) {
    data.quizzes.splice(indexOfQuizInData, 1);
  }

  const indexOfQuizInUserOwned = user.quizzesOwned.findIndex(ownedQuizId => ownedQuizId === quizId);
  if (indexOfQuizInUserOwned !== -1) {
    user.quizzesOwned.splice(indexOfQuizInUserOwned, 1);
  }
  setData(data);
  return {};
};

/**
 * Updates the description of the relevant quiz.
 *
 * @param {string} authUserId - The ID of the user making the update.
 * @param {string} quizId - The ID of the quiz to be updated.
 * @param {string} description - The new description for the quiz.
 *
 * @returns {object} An empty object.
 *
 * @throws {Error} If an error occurs.
 */
export const adminQuizDescriptionUpdate = (authUserId: number, quizId: number, description: string): EmptyObject | ErrorObject => {
  const data = getData();
  const user = getUser(authUserId);
  const quiz = getQuiz(quizId);

  if (description.length > 100) {
    return { error: 'Description is more than 100 characters in length' };
  }

  if (!user) {
    return { error: 'AuthUserId is not a valid user' };
  }

  if (!quiz) {
    return { error: 'Quiz ID does not refer to a valid quiz' };
  }

  const doesUserOwnQuiz = user.quizzesOwned.find(u => u === quizId);

  if (!doesUserOwnQuiz) {
    return { error: 'Quiz ID does not refer to a quiz that this user owns' };
  }

  quiz.description = description;
  quiz.timeLastEdited = Math.floor((new Date()).getTime() / 1000);
  setData(data);

  return {};
};

/**
 * Update the name of the relevant quiz.
 *
 * @param {number} authUserId
 * @param {number} quizId
 * @param {string} name
 * @returns {} empty
 * @returns {string} error
 */
export const adminQuizNameUpdate = (authUserId: number, quizId: number, name: string): EmptyObject | ErrorObject => {
  const data = getData();
  const curUser = getUser(authUserId);
  const curQuizzes = data.quizzes.filter(quiz => curUser.quizzesOwned.includes(quiz.quizId));
  const curQuizzesNames = curQuizzes.map(quiz => quiz.name);

  if (!getUser(authUserId)) {
    return {
      error: 'AuthUserId is not a valid user'
    };
  } else if (!getQuiz(quizId)) {
    return {
      error: 'Quiz ID does not refer to a valid quiz'
    };
  } else if (!curUser.quizzesOwned.includes(quizId)) {
    return {
      error: 'Quiz ID does not refer to a quiz that this user owns'
    };
  } else if (!validator.isAlphanumeric(name.replace(/\s/g, ''))) {
    return {
      error: 'Name contains invalid characters. Valid characters are alphanumeric and spaces'
    };
  } else if (name.length < 3 || name.length > 30) {
    return {
      error: 'Name is either less than 3 characters long or more than 30 characters long'
    };
  } else if (curQuizzesNames.includes(name)) {
    return {
      error: 'Name is already used by the current logged in user for another quiz'
    };
  }
  getQuiz(quizId).name = name;
  getQuiz(quizId).timeLastEdited = Math.floor((new Date()).getTime() / 1000);
  setData(data);

  return {};
};

/**
 * Get all of the relevant information about the current quiz.
 *
 * @param {Number} authUserId
 * @param {Number} quizId
 * @returns {object} quiz info
 */
export const adminQuizInfo = (authUserId: number, quizId: number): Quiz | ErrorObject => {
  const user = getUser(authUserId);
  const quiz = getQuiz(quizId);
  if (!user) {
    return { error: 'AuthUserId is not a valid user' };
  }

  if (!quiz) {
    return { error: 'Quiz ID does not refer to a valid quiz' };
  }

  if (!user.quizzesOwned.includes(quizId)) {
    return { error: 'Quiz ID does not refer to a quiz that this user owns' };
  }

  return {
    quizId: quiz.quizId,
    name: quiz.name,
    timeCreated: quiz.timeCreated,
    timeLastEdited: quiz.timeLastEdited,
    description: quiz.description,
  };
};

/**
 *
 * Provide a list of all quizzes that are owned by the currently logged in user.
 *
 * @param {number} authUserId
 * @returns {Object} quizId
 *
 */
export const adminQuizList = (authUserId: number): QuizListReturn | ErrorObject => {
  const userId = getUser(authUserId);
  const quizzes = [];

  if (!userId) {
    return { error: 'AuthUserId is not a valid user' };
  }

  for (const id in userId.quizzesOwned) {
    const quizList = userId.quizzesOwned[id]; // Array of quizzesOwned
    const quizInfo = getQuiz(quizList); // Find relevant quiz object
    quizzes.push(
      {
        quizId: quizInfo.quizId,
        name: quizInfo.name,
      }
    );
  }

  return {
    quizzes: quizzes,
  };
};

export const adminUpdateQuiz = (quizId: number, questionId: number, sessionId: string, questionBody: questionBody): EmptyObject | ErrorObject => {
  const data = getData();
  const quiz = getQuiz(quizId);
  const token = (getToken(sessionId));
    
  if (!token) {
    return {
      error: 'Token is empty or invalid (does not refer to valid logged in user session)',
      status: '401',
    };
  }


  const user = getUser(token.authUserId);
  
  if (!user) {
    return {
      error: 'Token is empty or invalid (does not refer to valid logged in user session)',
      status: '401',
    };
  }

  const question = quiz?.questions.find(question => question.questionId === questionId);

  if (!quiz || !question) {
    return {
      error: 'Question Id does not refer to a valid question within this quiz',
      status: '400',
    };
  }

  if (!user.quizzesOwned.find(quiz => quiz === quizId)) {
    return {
      error: 'Valid token is provided, but user is unauthorised to complete this action',
      status: '401',
    };
  }

  if (questionBody.question.length < 5 || questionBody.question.length > 50) {
    return {
      error: 'Question Id does not refer to a valid question within this quiz',
      status: '400',
    };
  }

  if (questionBody.answers.length < 2 || questionBody.answers.length > 6) {
    return {
      error: 'The question has more than 6 answers or less than 2 answers',
      status: '400',
    };
  }

  if (questionBody.duration <= 0) {
    return {
      error: 'The question duration is not a positive number',
      status: '400',
    };
  }

  const sum = quiz.questions.reduce((a, b) => {
    if (a === 0) return b;
    return a.duration + b.duration;
  },0) - question.duration + questionBody.duration;

  if (sum > 180) {
    return {
      error: 'If this question were to be updated, the sum of the question durations in the quiz exceeds 3 minutes',
      status: '400',
    };
  }

  if (questionBody.points < 1 || questionBody.points > 10) {
    return {
      error: 'The points awarded for the question are less than 1 or greater than 10',
      status: '400',
    };
  }

  if (questionBody.answers.find(answer => answer.answer.length < 1) || questionBody.answers.find(answer => answer.answer.length > 30)) {
    return {
      error: 'The length of any answer is shorter than 1 character long, or longer than 30 characters long',
      status: '400',
    };
  }

  for (let i = 0; i < questionBody.answers.length; i++) {

    for (let j = i + 1; j < questionBody.answers.length; j++) {

      if (questionBody.answers[i].answer === questionBody.answers[j].answer) {
        return {
          error: 'Any answer strings are duplicates of one another (within the same question)',
          status: '400',
        };
      }

    }
  }

  if (!questionBody.answers.find(answer => answer.correct === true)) {
    return {
      error: 'There are no correct answers',
      status: '400',
    };
  }
  const colour = ['red', 'green', 'blue'];

  const answers: Answer[] = [];

  for (const index in questionBody.answers) {
    answers[index].answerId = Number(index);
    answers[index].answer = questionBody.answers[index].answer;
    answers[index].colour = colour[Math.floor(Math.random()) % 3];
    answers[index].correct = questionBody.answers[index].correct;
  }

  question.answers = answers;
  question.duration = questionBody.duration;
  question.points = questionBody.points;
  question.question = questionBody.question;

  quiz.timeLastEdited = Math.floor((new Date()).getTime() / 1000);
  setData(data);
  return{}
}