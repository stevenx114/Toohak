import {
  getData,
  setData,
  Quiz
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
  QuestionBody,
  QuestionId,
  getToken,
} from './types';

import {
  Token,
} from './dataStore';


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
// export const adminQuizCreate = (authUserId: number, name: string, description: string): QuizIdReturn | ErrorObject => {
//   const data = getData();
//   const specialChar = /[^a-zA-Z0-9\s]/;
//   const userId = getUser(authUserId);

//   if (!userId) {
//     return { error: 'AuthUserId is not a valid user' };
//   }

//   if (!name) {
//     return { error: 'name cannot be empty' };
//   } else if (name.length < 3) {
//     return { error: 'name needs to be at least 3 characters' };
//   } else if (name.length > 30) {
//     return { error: 'name cannot exceed 30 characters' };
//   } else if (description.length > 100) {
//     return { error: 'description cannot exceed 100 characters' };
//   } else if (specialChar.test(name)) {
//     return { error: 'name can only contain alphanumeric and space characters' };
//   }

//   for (const id in userId.quizzesOwned) {
//     const quizIdOwned = userId.quizzesOwned[id];
//     const quizInfo = getQuiz(quizIdOwned);
//     if (quizInfo.name === name) {
//       return { error: 'quiz name is already in use' };
//     }
//   }

//   const newQuizId = parseInt(uuidv4().replace(/-/g, ''), 16);

//   data.quizzes.push(
//     {
//       quizId: newQuizId,
//       name: name,
//       timeCreated: Math.floor((new Date()).getTime() / 1000),
//       timeLastEdited: Math.floor((new Date()).getTime() / 1000),
//       description: description,
//     }
//   );

//   userId.quizzesOwned.push(newQuizId); // Updates the quizzes owned by current user
//   setData(data);

//   return {
//     quizId: newQuizId,
//   };
// };

// /**
//  * Given a particular quiz, permanently remove the quiz.
//  *
//  * @param {number} authUserId of integers
//  * @param {number} quizId of integers
//  * @returns {object} empty object
//  */
// export const adminQuizRemove = (authUserId: number, quizId: number): EmptyObject | ErrorObject => {
//   const data = getData();
//   const user = getUser(authUserId);
//   if (!user) {
//     return {
//       error: 'AuthUserId is not a valid user'
//     };
//   }
//   if (!getQuiz(quizId)) {
//     return {
//       error: 'Quiz ID does not refer to a valid quiz'
//     };
//   }
//   if (!user.quizzesOwned.includes(quizId)) {
//     return {
//       error: 'Quiz ID does not refer to a quiz that this user owns'
//     };
//   }
//   const indexOfQuizInData = data.quizzes.findIndex(quiz => quiz.quizId === quizId);
//   if (indexOfQuizInData !== -1) {
//     data.quizzes.splice(indexOfQuizInData, 1);
//   }

//   const indexOfQuizInUserOwned = user.quizzesOwned.findIndex(ownedQuizId => ownedQuizId === quizId);
//   if (indexOfQuizInUserOwned !== -1) {
//     user.quizzesOwned.splice(indexOfQuizInUserOwned, 1);
//   }
//   setData(data);
//   return {};
// };

// /**
//  * Updates the description of the relevant quiz.
//  *
//  * @param {string} authUserId - The ID of the user making the update.
//  * @param {string} quizId - The ID of the quiz to be updated.
//  * @param {string} description - The new description for the quiz.
//  *
//  * @returns {object} An empty object.
//  *
//  * @throws {Error} If an error occurs.
//  */
// export const adminQuizDescriptionUpdate = (authUserId: number, quizId: number, description: string): EmptyObject | ErrorObject => {
//   const data = getData();
//   const user = getUser(authUserId);
//   const quiz = getQuiz(quizId);

//   if (description.length > 100) {
//     return { error: 'Description is more than 100 characters in length' };
//   }

//   if (!user) {
//     return { error: 'AuthUserId is not a valid user' };
//   }

//   if (!quiz) {
//     return { error: 'Quiz ID does not refer to a valid quiz' };
//   }

//   const doesUserOwnQuiz = user.quizzesOwned.find(u => u === quizId);

//   if (!doesUserOwnQuiz) {
//     return { error: 'Quiz ID does not refer to a quiz that this user owns' };
//   }

//   quiz.description = description;
//   quiz.timeLastEdited = Math.floor((new Date()).getTime() / 1000);
//   setData(data);

//   return {};
// };

// /**
//  * Update the name of the relevant quiz.
//  *
//  * @param {number} authUserId
//  * @param {number} quizId
//  * @param {string} name
//  * @returns {} empty
//  * @returns {string} error
//  */
// export const adminQuizNameUpdate = (authUserId: number, quizId: number, name: string): EmptyObject | ErrorObject => {
//   const data = getData();
//   const curUser = getUser(authUserId);
//   const curQuizzes = data.quizzes.filter(quiz => curUser.quizzesOwned.includes(quiz.quizId));
//   const curQuizzesNames = curQuizzes.map(quiz => quiz.name);

//   if (!getUser(authUserId)) {
//     return {
//       error: 'AuthUserId is not a valid user'
//     };
//   } else if (!getQuiz(quizId)) {
//     return {
//       error: 'Quiz ID does not refer to a valid quiz'
//     };
//   } else if (!curUser.quizzesOwned.includes(quizId)) {
//     return {
//       error: 'Quiz ID does not refer to a quiz that this user owns'
//     };
//   } else if (!validator.isAlphanumeric(name.replace(/\s/g, ''))) {
//     return {
//       error: 'Name contains invalid characters. Valid characters are alphanumeric and spaces'
//     };
//   } else if (name.length < 3 || name.length > 30) {
//     return {
//       error: 'Name is either less than 3 characters long or more than 30 characters long'
//     };
//   } else if (curQuizzesNames.includes(name)) {
//     return {
//       error: 'Name is already used by the current logged in user for another quiz'
//     };
//   }
//   getQuiz(quizId).name = name;
//   getQuiz(quizId).timeLastEdited = Math.floor((new Date()).getTime() / 1000);
//   setData(data);

//   return {};
// };

// /**
//  * Get all of the relevant information about the current quiz.
//  *
//  * @param {Number} authUserId
//  * @param {Number} quizId
//  * @returns {object} quiz info
//  */
// export const adminQuizInfo = (authUserId: number, quizId: number): Quiz | ErrorObject => {
//   const user = getUser(authUserId);
//   const quiz = getQuiz(quizId);
//   if (!user) {
//     return { error: 'AuthUserId is not a valid user' };
//   }

//   if (!quiz) {
//     return { error: 'Quiz ID does not refer to a valid quiz' };
//   }

//   if (!user.quizzesOwned.includes(quizId)) {
//     return { error: 'Quiz ID does not refer to a quiz that this user owns' };
//   }

//   return {
//     quizId: quiz.quizId,
//     name: quiz.name,
//     timeCreated: quiz.timeCreated,
//     timeLastEdited: quiz.timeLastEdited,
//     description: quiz.description,
//   };
// };

// /**
//  *
//  * Provide a list of all quizzes that are owned by the currently logged in user.
//  *
//  * @param {number} authUserId
//  * @returns {Object} quizId
//  *
//  */
// export const adminQuizList = (authUserId: number): QuizListReturn | ErrorObject => {
//   const userId = getUser(authUserId);
//   const quizzes = [];

//   if (!userId) {
//     return { error: 'AuthUserId is not a valid user' };
//   }

//   for (const id in userId.quizzesOwned) {
//     const quizList = userId.quizzesOwned[id]; // Array of quizzesOwned
//     const quizInfo = getQuiz(quizList); // Find relevant quiz object
//     quizzes.push(
//       {
//         quizId: quizInfo.quizId,
//         name: quizInfo.name,
//       }
//     );
//   }

//   return {
//     quizzes: quizzes,
//   };
// };

const duplicateAnswers = (questionBody: QuestionBody): boolean => {
  const set = new Set<string();
  return question.answers.some((element) => {
    if (set.has(element.answer)) {
      return true; 
    } else {
      set.add(element.answer);
      return false;
    }
  });
}

/**
 * 
 * @param quizid 
 * @param token 
 * @param questionBody 
 */
export const adminQuizQuestionCreate = (quizid: number, authuserId: number, token: string, questionBody: QuestionBody): QuestionId | ErrorObject => {
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
      statusCode: 400
    };
  } else if (findToken.sessionId !== quiz.ownerId) { 
    return { 
      error: 'Token does not belong to quiz owner',
      statusCode: 400
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
};


