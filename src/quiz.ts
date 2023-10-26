import {
  getData,
  setData,
  Quiz
} from './dataStore';

import {
  generateCustomUuid
} from 'custom-uuid';

import validator from 'validator';

import {
  getUser,
  getQuiz,
  getToken,
  QuizIdReturn,
  ErrorObject,
  QuizListReturn,
  EmptyObject,
  trashedQuizReturn,
} from './types';

/**
 * Given basic details about a new quiz, create one for the logged in user.
 *
 * @param {string} sessionId
 * @param {string} name
 * @param {string} description
 * @returns {object} QuizIdReturn | ErrorObject
 */
export const adminQuizCreate = (sessionId: string, name: string, description: string): QuizIdReturn | ErrorObject => {
  const data = getData();
  const specialChar = /[^a-zA-Z0-9\s]/;
  const curToken = getToken(sessionId);
  if (!curToken) {
    return {
      error: 'Token does not refer to valid logged in user session'
    };
  }
  const curUserId = curToken.authUserId;
  const curUser = getUser(curUserId);
  const curQuizzes = data.quizzes.filter(quiz => curUser.quizzesOwned.includes(quiz.quizId));
  const curQuizzesNames = curQuizzes.map(quiz => quiz.name);
  const newQuizId = parseInt(generateCustomUuid('0123456789', 12));

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
  } else if (curQuizzesNames.includes(name)) {
    return { error: 'Name is already used by the current logged in user for another quiz' };
  }

  data.quizzes.push(
    {
      quizId: newQuizId,
      name: name,
      timeCreated: Math.floor((new Date()).getTime() / 1000),
      timeLastEdited: Math.floor((new Date()).getTime() / 1000),
      description: description,
      numQuestions: 0,
      questions: []
    }
  );

  curUser.quizzesOwned.push(newQuizId); // Updates the quizzes owned by current user
  setData(data);

  return {
    quizId: newQuizId
  };
};

/**
 * Given a particular quiz, permanently remove the quiz.
 *
 * @param {string} sessionId
 * @param {number} quizId
 * @returns {object} EmptyObject | ErrorObject
 */
export const adminQuizRemove = (sessionId: string, quizId: number): EmptyObject | ErrorObject => {
  const data = getData();
  const curToken = getToken(sessionId);
  if (!curToken) {
    return {
      error: 'Token does not refer to valid logged in user session'
    };
  }
  const userId = curToken.authUserId;
  const user = getUser(userId);

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
    data.trash.push(data.quizzes[indexOfQuizInData]);
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
 * @param {string} sessionId - The ID of the current user session.
 * @param {number} quizId - The ID of the quiz to be updated.
 * @param {string} description - The new description for the quiz.
 * @returns {object} EmptyObject | ErrorObject
 */
export const adminQuizDescriptionUpdate = (sessionId: string, quizId: number, description: string): EmptyObject | ErrorObject => {
  const data = getData();
  const curToken = getToken(sessionId);
  if (!curToken) {
    return {
      error: 'Token does not refer to valid logged in user session'
    };
  }
  const userId = curToken.authUserId;
  const user = getUser(userId);
  const quiz = getQuiz(quizId);

  if (description.length > 100) {
    return { error: 'Description is more than 100 characters in length' };
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
 * @param {string} sessionId
 * @param {number} quizId
 * @param {string} name
 * @returns {object} EmptyObject | ErrorObject
 */
export const adminQuizNameUpdate = (sessionId: string, quizId: number, name: string): EmptyObject | ErrorObject => {
  const data = getData();
  const curToken = getToken(sessionId);
  if (!curToken) {
    return {
      error: 'Token does not refer to valid logged in user session'
    };
  }
  const curUserId = curToken.authUserId;
  const curUser = getUser(curUserId);
  const curQuizzes = data.quizzes.filter(quiz => curUser.quizzesOwned.includes(quiz.quizId));
  const curQuizzesNames = curQuizzes.map(quiz => quiz.name);

  if (!getQuiz(quizId)) {
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
 * @param {String} sessionId
 * @param {Number} quizId
 * @returns {object} Quiz
 */
export const adminQuizInfo = (sessionId: string, quizId: number): Quiz | ErrorObject => {
  const curToken = getToken(sessionId);
  if (!curToken) {
    return {
      error: 'Token does not refer to valid logged in user session'
    };
  }
  const quiz = getQuiz(quizId);
  if (!quiz) {
    return { error: 'Quiz ID does not refer to a valid quiz' };
  }
  const userId = getToken.authUserId;
  const curUser = getUser(userId);
  if (!curUser.quizzesOwned.includes(quizId)) {
    return { error: 'Quiz ID does not refer to a quiz that this user owns' };
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

/**
 *
 * Provide a list of all quizzes that are owned by the currently logged in user.
 *
 * @param {String} sessionId
 * @returns {Object} quizId
 *
 */
export const adminQuizList = (sessionId: string): QuizListReturn | ErrorObject => {
  const data = getData();
  const curToken = getToken(sessionId);
  if (!curToken) {
    return {
      error: 'Token does not refer to valid logged in user session'
    };
  }
  const userId = curToken.authUserId;
  const curUser = getUser(userId);
  const curQuizzes = data.quizzes.filter(quiz => curUser.quizzesOwned.includes(quiz.quizId));
  const quizInfo = curQuizzes.map(quiz => ({ quizId: quiz.quizId, name: quiz.name }));
  return {
    quizzes: quizInfo
  };
};


export const viewQuizTrash = (token: string): trashedQuizReturn | ErrorObject  => {
  const user = getUser(getToken(token).authUserId);
  
  if (!user) {
    return { error: 'Token is empty or invalid (does not refer to valid logged in user session)'};
  }

  const data = getData();

  const quizzesInTrash = []

  for (const quizzesOwned of user.quizzesOwned) {

    const currTrashedQuiz = data.trash.find(quiz => quiz.quizId === quizzesOwned);

    if (currTrashedQuiz) {
      const trashQuizData = {
        quizId: currTrashedQuiz.quizId,
        name: currTrashedQuiz.name,
      };

      quizzesInTrash.push(trashQuizData);
    }

  }

  return {
    quizzes: quizzesInTrash,
  };
}

