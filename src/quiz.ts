import {
  getData,
  setData,
  Quiz
} from './dataStore';

import validator from 'validator';

import {
  generateCustomUuid
} from 'custom-uuid';

import {
  getUser,
  getToken,
  getQuiz,
  ErrorObject,
  QuizIdReturn,
  QuizListReturn,
  EmptyObject,
  QuestionBody,
  QuestionId,
  getToken,
} from './types';

import {
  Token,
} from './dataStore';


/**
 * Given basic details about a new quiz, create one for the logged in user.
 *
 * @param {string} token
 * @param {string} name
 * @param {string} description
 * @returns {object} QuizIdReturn | ErrorObject
 */
<<<<<<< HEAD
export const adminQuizCreate = (sessionId: string, name: string, description: string): QuizIdReturn | ErrorObject => {
  const data = getData();
  const specialChar = /[^a-zA-Z0-9\s]/;
  const curToken = getToken(sessionId);
  if (!curToken) {
    return {
      error: 'Token does not refer to valid logged in user session',
      statusCode: 400,
=======
export const adminQuizCreate = (token: string, name: string, description: string): QuizIdReturn | ErrorObject => {
  const data = getData();
  const specialChar = /[^a-zA-Z0-9\s]/;
  const curToken = getToken(token);

  if (!curToken) {
    return {
      error: 'Token does not refer to valid logged in user session',
      statusCode: 401,
>>>>>>> 9761e25ebbc12b376c6be418396e043d8d6eed56
    };
  }
  const curUserId = curToken.authUserId;
  const curUser = getUser(curUserId);
  const curQuizzes = data.quizzes.filter(quiz => curUser.quizzesOwned.includes(quiz.quizId));
  const curQuizzesNames = curQuizzes.map(quiz => quiz.name);
  const newQuizId = parseInt(generateCustomUuid('0123456789', 12));

  if (!name) {
<<<<<<< HEAD
    return { 
=======
    return {
>>>>>>> 9761e25ebbc12b376c6be418396e043d8d6eed56
      error: 'name cannot be empty',
      statusCode: 400,
    };
  } else if (name.length < 3) {
<<<<<<< HEAD
    return { 
=======
    return {
>>>>>>> 9761e25ebbc12b376c6be418396e043d8d6eed56
      error: 'name needs to be at least 3 characters',
      statusCode: 400,
    };
  } else if (name.length > 30) {
<<<<<<< HEAD
    return { 
=======
    return {
>>>>>>> 9761e25ebbc12b376c6be418396e043d8d6eed56
      error: 'name cannot exceed 30 characters',
      statusCode: 400,
    };
  } else if (description.length > 100) {
<<<<<<< HEAD
    return { 
=======
    return {
>>>>>>> 9761e25ebbc12b376c6be418396e043d8d6eed56
      error: 'description cannot exceed 100 characters',
      statusCode: 400,
    };
  } else if (specialChar.test(name)) {
<<<<<<< HEAD
    return { 
=======
    return {
>>>>>>> 9761e25ebbc12b376c6be418396e043d8d6eed56
      error: 'name can only contain alphanumeric and space characters',
      statusCode: 400,
    };
  } else if (curQuizzesNames.includes(name)) {
<<<<<<< HEAD
    return { 
      error: 'Name is already used by the current logged in user for another quiz',
      statusCode: 400,
     };
=======
    return {
      error: 'Name is already used by the current logged in user for another quiz',
      statusCode: 400,
    };
>>>>>>> 9761e25ebbc12b376c6be418396e043d8d6eed56
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
<<<<<<< HEAD
 * @param {string} sessionId
 * @param {number} quizId
 * @returns {object} EmptyObject | ErrorObject
 */
export const adminQuizRemove = (sessionId: string, quizId: number): EmptyObject | ErrorObject => {
  const data = getData();
  const curToken = getToken(sessionId);
=======
 * @param {string} token
 * @param {number} quizId
 * @returns {object} EmptyObject | ErrorObject
 */
export const adminQuizRemove = (token: string, quizId: number): EmptyObject | ErrorObject => {
  const data = getData();
  const curToken = getToken(token);
>>>>>>> 9761e25ebbc12b376c6be418396e043d8d6eed56
  if (!curToken) {
    return {
      error: 'Token does not refer to valid logged in user session',
      statusCode: 401,
<<<<<<< HEAD
    };
  }
  const userId = curToken.authUserId;
  const user = getUser(userId);

  if (!user) {
    return {
      error: 'AuthUserId is not a valid user',
      statusCode: 403
    };
  }
 
=======
    };
  }
  const userId = curToken.authUserId;
  const user = getUser(userId);

>>>>>>> 9761e25ebbc12b376c6be418396e043d8d6eed56
  if (!user.quizzesOwned.includes(quizId)) {
    return {
      error: 'Quiz ID does not refer to a quiz that this user owns',
      statusCode: 403
    };
  }
  const indexOfQuizInData = data.quizzes.findIndex(quiz => quiz.quizId === quizId);
  if (indexOfQuizInData !== -1) {
<<<<<<< HEAD
=======
    data.quizzes[indexOfQuizInData].timeLastEdited = Math.floor((new Date()).getTime() / 1000);
>>>>>>> 9761e25ebbc12b376c6be418396e043d8d6eed56
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
<<<<<<< HEAD
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
  
=======
 * Get all of the relevant information about the current quiz.
 *
 * @param {String} token
 * @param {Number} quizId
 * @returns {object} Quiz
 */
export const adminQuizInfo = (token: string, quizId: number): Quiz | ErrorObject => {
  const curToken = getToken(token);

>>>>>>> 9761e25ebbc12b376c6be418396e043d8d6eed56
  if (!curToken) {
    return {
      error: 'Token does not refer to valid logged in user session',
      statusCode: 401,
    };
  }
<<<<<<< HEAD
  
  if (description.length > 100) {
    return { 
      error: 'Description is more than 100 characters in length',
      statusCode: 400,
=======
  const quiz = getQuiz(quizId);

  const userId = curToken.authUserId;
  const curUser = getUser(userId);
  if (!curUser.quizzesOwned.includes(quizId)) {
    return {
      error: 'Quiz ID does not refer to a quiz that this user owns',
      statusCode: 403,
>>>>>>> 9761e25ebbc12b376c6be418396e043d8d6eed56
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

<<<<<<< HEAD
  const userId = curToken.authUserId;
  const user = getUser(userId);
  const quiz = getQuiz(quizId);
  
  const doesUserOwnQuiz = user.quizzesOwned.includes(quizId);

  if (doesUserOwnQuiz === false) {
    return { 
      error: 'Quiz ID does not refer to a quiz that this user owns',
      statusCode: 403,
     };
  }

  quiz.description = description;
  quiz.timeLastEdited = Math.floor((new Date()).getTime() / 1000);
  setData(data);

  return { };
=======
/**
 *
 * Provide a list of all quizzes that are owned by the currently logged in user.
 *
 * @param {String} token
 * @returns {Object} quizId
 *
 */
export const adminQuizList = (token: string): QuizListReturn | ErrorObject => {
  const data = getData();
  const curToken = getToken(token);
  if (!curToken) {
    return {
      error: 'Token does not refer to valid logged in user session',
      statusCode: 401,
    };
  }
  const userId = curToken.authUserId;
  const curUser = getUser(userId);
  const curQuizzes = data.quizzes.filter(quiz => curUser.quizzesOwned.includes(quiz.quizId));
  const quizInfo = curQuizzes.map(quiz => ({ quizId: quiz.quizId, name: quiz.name }));
  return {
    quizzes: quizInfo
  };
>>>>>>> 9761e25ebbc12b376c6be418396e043d8d6eed56
};

/**
 * Update the name of the relevant quiz.
 *
<<<<<<< HEAD
 * @param {string} sessionId
=======
 * @param {string} token
>>>>>>> 9761e25ebbc12b376c6be418396e043d8d6eed56
 * @param {number} quizId
 * @param {string} name
 * @returns {object} EmptyObject | ErrorObject
 */
<<<<<<< HEAD
export const adminQuizNameUpdate = (sessionId: string, quizId: number, name: string): EmptyObject | ErrorObject => {  
  const data = getData();
  console.log(data);
  const curToken = getToken(sessionId);

=======
export const adminQuizNameUpdate = (token: string, quizId: number, name: string): EmptyObject | ErrorObject => {
  const data = getData();
  const curToken = getToken(token);
>>>>>>> 9761e25ebbc12b376c6be418396e043d8d6eed56
  if (!curToken) {
    return {
      error: 'Token does not refer to valid logged in user session',
      statusCode: 401
    };
  }
<<<<<<< HEAD
 
=======

>>>>>>> 9761e25ebbc12b376c6be418396e043d8d6eed56
  const curUserId = curToken.authUserId;
  const curUser = getUser(curUserId);
  const curQuizzes = data.quizzes.filter(quiz => curUser.quizzesOwned.includes(quiz.quizId));
  const curQuizzesNames = curQuizzes.map(quiz => quiz.name);
  if (!validator.isAlphanumeric(name.replace(/\s/g, ''))) {
    return {
      error: 'Name contains invalid characters. Valid characters are alphanumeric and spaces',
      statusCode: 400
    };
<<<<<<< HEAD
  } 
  
=======
  }

>>>>>>> 9761e25ebbc12b376c6be418396e043d8d6eed56
  if (name.length < 3 || name.length > 30) {
    return {
      error: 'Name is either less than 3 characters long or more than 30 characters long',
      statusCode: 400
    };
<<<<<<< HEAD
  } 
  
=======
  }

>>>>>>> 9761e25ebbc12b376c6be418396e043d8d6eed56
  if (curQuizzesNames.includes(name)) {
    return {
      error: 'Name is already used by the current logged in user for another quiz',
      statusCode: 400
    };
<<<<<<< HEAD
  } 
=======
  }
>>>>>>> 9761e25ebbc12b376c6be418396e043d8d6eed56

  if (!curUser.quizzesOwned.includes(quizId)) {
    return {
      error: 'Quiz ID does not refer to a quiz that this user owns',
      statusCode: 403
    };
<<<<<<< HEAD
  } 
=======
  }
>>>>>>> 9761e25ebbc12b376c6be418396e043d8d6eed56

  getQuiz(quizId).name = name;
  getQuiz(quizId).timeLastEdited = Math.floor((new Date()).getTime() / 1000);
  setData(data);

  return {};
};

/**
 * Updates the description of the relevant quiz.
 *
<<<<<<< HEAD
 * @param {String} sessionId
 * @param {Number} quizId
 * @returns {object} Quiz
 */
export const adminQuizInfo = (sessionId: string, quizId: number): Quiz | ErrorObject => {
  const curToken = getToken(sessionId);
  const data = getData();
  
=======
 * @param {string} token - The ID of the current user session.
 * @param {number} quizId - The ID of the quiz to be updated.
 * @param {string} description - The new description for the quiz.
 * @returns {object} EmptyObject | ErrorObject
 */
export const adminQuizDescriptionUpdate = (token: string, quizId: number, description: string): EmptyObject | ErrorObject => {
  const data = getData();
  const curToken = getToken(token);

>>>>>>> 9761e25ebbc12b376c6be418396e043d8d6eed56
  if (!curToken) {
    return {
      error: 'Token does not refer to valid logged in user session',
      statusCode: 401,
    };
  }
  const quiz = getQuiz(quizId);

<<<<<<< HEAD
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
      error: 'Token does not refer to valid logged in user session',
      statusCode: 401,
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


/**
 * 
 * @param quizid 
 * @param token 
 * @param questionBody 
 */
export const adminQuizQuestionCreate = (quizid: number, token: string, questionBody: QuestionBody): QuestionId | ErrorObject => {
  const data: DataStore = getData();
  const quiz = getQuiz(quizid);
  
  const findToken = getToken(token) as Token;

  const minAnswerLength = questionBody.answers.every((element) => element.answer.length >= 1); // checks if every asnwer is at least 1
  const maxAnswerLength = questionBody.answers.every((element) => element.answer.length <= 10); // checks if every answer is at most 10
  const noCorrectAnswer = questionBody.answers.some((element) => element.correct !== true); // checks if there are no correct answers

  if (questionBody.question.length < 5 || questionBody.question.length > 50) {
    return { 
      error: 'Invalid question length',
      statusCode: 400
    };
  } else if (questionBody.duration <= 0) {
    return { 
      error: 'Question duration cannot be smaller than 0',
      statusCode: 400
    };
  } else if (questionBody.points < 1 || questionBody.points > 10) {
    return { 
      error: 'Invalid number of points',
      statusCode: 400   
    };
  } else if (questionBody.answers.length > 6 || questionBody.answers.length < 2) {
    return { 
      error: 'Invalid number of answers',
      statusCode: 400
    };
  } else if (!maxAnswerLength || !minAnswerLength) {
    return { 
      error: 'Invalid string length of answers',
      statusCode: 400
    }; 
  } else if (duplicateAnswers) {
    return { 
      error: 'Question answers cannot have duplicate tests',
      statusCode: 400
    };
  } else if (noCorrectAnswer) {
    return { 
      error: 'Question must have a correct answer', 
      statusCode: 400
    };
  } else if (!token) {
    return { 
      error: 'Token cannot be empty',
      statusCode: 400
    };
  } else if (questionBody.duration + quiz.duration > 180) {
    return { 
      error: 'Quiz duration cannot be longer than 3 minutes',
      statusCode: 400
    };
  } else if (!findToken) {
    return { 
      error: 'Invalid token',
      statusCode: 401
    };
  } else if (findToken.authUserId !== quiz.ownerId) { 
    return { 
      error: 'Token does not belong to quiz owner',
      statusCode: 403
    };
  } 

  quiz.duration += questionBody.duration; // Update duration of quiz
  quiz.timeLastEdited = Math.floor((new Date()).getTime() / 1000); // Update timeLastEdited of quiz

  const colourArray = ['red', 'blue', 'green', 'yellow', 'purple', 'brown', 'orange'];
  const newQuestionId = parseint(generateCustomUuid("0123456789", 12));
  const answers = [];

  for (const choice in questionBody.answers) {
    let createAnswerId;
    if (Answers.length === 0) {
      createAnswerId = 0;
    } else {
      createAnswerId = answers[answers.length - 1].answerId + 1;
    }

    const randomElement = Math.floor(Math.random() * colors.length);
    const newColour = colors[randomElement];

    const answerObject = {
      answerId: createAnswerId,
      answer: answers.choice,
      colour: newColour,
      correct: choice.correct,
    };

    answers.push(answerObject);
  }

  const newQuestion = {
    questionId: newQuestionId,
    question: questionBody.question,
    duration: questionBody.duration,
    points: questionBody.points,
    answers: answerObject,
  }

  quiz.questions.push(newQuestion);



  setData(data);

  return {
    questionId: newQuestionId
  }
=======
  if (description.length > 100) {
    return {
      error: 'Description is more than 100 characters in length',
      statusCode: 400,
    };
  }

  const userId = curToken.authUserId;
  const user = getUser(userId);
  const quiz = getQuiz(quizId);

  const doesUserOwnQuiz = user.quizzesOwned.includes(quizId);

  if (doesUserOwnQuiz === false) {
    return {
      error: 'Quiz ID does not refer to a quiz that this user owns',
      statusCode: 403,
    };
  }

  quiz.description = description;
  quiz.timeLastEdited = Math.floor((new Date()).getTime() / 1000);
  setData(data);

  return { };
>>>>>>> 9761e25ebbc12b376c6be418396e043d8d6eed56
};


