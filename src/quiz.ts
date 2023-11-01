import {
  getData,
  setData,
  Quiz,
  Token,
  Answer
} from './dataStore';

import validator from 'validator';

import {
  generateCustomUuid
} from 'custom-uuid';

import {
  getUser,
  getToken,
  getQuiz,
  getQuestion,
  ErrorObject,
  QuizIdReturn,
  QuizListReturn,
  EmptyObject,
  trashedQuizReturn,
  getUserByEmail,
  QuestionBody,
  QuestionIdReturn,
  QuestionDuplicateReturn
} from './types';

/**
 * Given basic details about a new quiz, create one for the logged in user.
 *
 * @param {string} token
 * @param {string} name
 * @param {string} description
 * @returns {object} QuizIdReturn | ErrorObject
 */
export const adminQuizCreate = (token: string, name: string, description: string): QuizIdReturn | ErrorObject => {
  const data = getData();
  const specialChar = /[^a-zA-Z0-9\s]/;
  const curToken = getToken(token);

  if (!curToken) {
    return {
      error: 'Token does not refer to valid logged in user session',
      statusCode: 401,
    };
  }
  const curUserId = curToken.authUserId;
  const curUser = getUser(curUserId);
  const curQuizzes = data.quizzes.filter(quiz => curUser.quizzesOwned.includes(quiz.quizId));
  const curQuizzesNames = curQuizzes.map(quiz => quiz.name);
  const newQuizId = parseInt(generateCustomUuid('0123456789', 12));

  if (!name) {
    return {
      error: 'name cannot be empty',
      statusCode: 400,
    };
  } else if (name.length < 3) {
    return {
      error: 'name needs to be at least 3 characters',
      statusCode: 400,
    };
  } else if (name.length > 30) {
    return {
      error: 'name cannot exceed 30 characters',
      statusCode: 400,
    };
  } else if (description.length > 100) {
    return {
      error: 'description cannot exceed 100 characters',
      statusCode: 400,
    };
  } else if (specialChar.test(name)) {
    return {
      error: 'name can only contain alphanumeric and space characters',
      statusCode: 400,
    };
  } else if (curQuizzesNames.includes(name)) {
    return {
      error: 'Name is already used by the current logged in user for another quiz',
      statusCode: 400,
    };
  }

  data.quizzes.push(
    {
      quizId: newQuizId,
      name: name,
      timeCreated: Math.floor((new Date()).getTime() / 1000),
      timeLastEdited: Math.floor((new Date()).getTime() / 1000),
      description: description,
      numQuestions: 0,
      questions: [],
      duration: 0
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
 * @param {string} token
 * @param {number} quizId
 * @returns {object} EmptyObject | ErrorObject
 */
export const adminQuizRemove = (token: string, quizId: number): EmptyObject | ErrorObject => {
  const data = getData();
  const curToken = getToken(token);
  if (!curToken) {
    return {
      error: 'Token does not refer to valid logged in user session',
      statusCode: 401,
    };
  }
  const userId = curToken.authUserId;
  const user = getUser(userId);

  if (!user.quizzesOwned.includes(quizId)) {
    return {
      error: 'Quiz ID does not refer to a quiz that this user owns',
      statusCode: 403
    };
  }
  const indexOfQuizInData = data.quizzes.findIndex(quiz => quiz.quizId === quizId);
  if (indexOfQuizInData !== -1) {
    data.quizzes[indexOfQuizInData].timeLastEdited = Math.floor((new Date()).getTime() / 1000);
    data.trash.push(data.quizzes[indexOfQuizInData]);
    data.quizzes.splice(indexOfQuizInData, 1);
  }

  setData(data);
  return {};
};

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
    questions: quiz.questions,
    duration: quiz.duration,
  };
};

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
};

/**
 * Update the name of the relevant quiz.
 *
 * @param {string} token
 * @param {number} quizId
 * @param {string} name
 * @returns {object} EmptyObject | ErrorObject
 */
export const adminQuizNameUpdate = (token: string, quizId: number, name: string): EmptyObject | ErrorObject => {
  const data = getData();
  const curToken = getToken(token);
  if (!curToken) {
    return {
      error: 'Token does not refer to valid logged in user session',
      statusCode: 401
    };
  }

  const curUserId = curToken.authUserId;
  const curUser = getUser(curUserId);
  const curQuizzes = data.quizzes.filter(quiz => curUser.quizzesOwned.includes(quiz.quizId));
  const curQuizzesNames = curQuizzes.map(quiz => quiz.name);
  if (!validator.isAlphanumeric(name.replace(/\s/g, ''))) {
    return {
      error: 'Name contains invalid characters. Valid characters are alphanumeric and spaces',
      statusCode: 400
    };
  }

  if (name.length < 3 || name.length > 30) {
    return {
      error: 'Name is either less than 3 characters long or more than 30 characters long',
      statusCode: 400
    };
  }

  if (curQuizzesNames.includes(name)) {
    return {
      error: 'Name is already used by the current logged in user for another quiz',
      statusCode: 400
    };
  }

  if (!curUser.quizzesOwned.includes(quizId)) {
    return {
      error: 'Quiz ID does not refer to a quiz that this user owns',
      statusCode: 403
    };
  }

  getQuiz(quizId).name = name;
  getQuiz(quizId).timeLastEdited = Math.floor((new Date()).getTime() / 1000);
  setData(data);

  return {};
};

/**
 * Updates the description of the relevant quiz.
 *
 * @param {string} token - The ID of the current user session.
 * @param {number} quizId - The ID of the quiz to be updated.
 * @param {string} description - The new description for the quiz.
 * @returns {object} EmptyObject | ErrorObject
 */
export const adminQuizDescriptionUpdate = (token: string, quizId: number, description: string): EmptyObject | ErrorObject => {
  const data = getData();
  const curToken = getToken(token);

  if (!curToken) {
    return {
      error: 'Token does not refer to valid logged in user session',
      statusCode: 401,
    };
  }

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
};

/**

Retrieve a list of trashed quizzes associated with the user identified by the provided token.*
@param {string} token - The authentication token for the user.
*
@returns {trashedQuizReturn|ErrorObject} An object containing trashed quizzes or an error object.
*/
export const viewQuizTrash = (token: string): trashedQuizReturn | ErrorObject => {
  const tokenObject = getToken(token);

  if (!tokenObject) {
    return {
      error: 'Token is empty or invalid (does not refer to valid logged in user session)',
      statusCode: 401,
    };
  }
  const user = getUser(tokenObject.authUserId);

  const data = getData();

  const quizzesInTrash = [];

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
};

/**
 * Restores a quiz from the trash for a given user if certain conditions are met.
 *
 * @param {number} quizId - The ID of the quiz to be restored.
 * @param {string} token - The session ID used to authenticate the user.
 *
 * @returns {EmptyObject | ErrorObject} An empty object if the quiz is successfully restored,
 * or an ErrorObject with details if the restoration encounters an error.
 */
export const quizRestore = (quizId: number, token: string): EmptyObject | ErrorObject => {
  const data = getData();

  const tokenObject = getToken(token);

  if (!tokenObject) {
    return {
      error: 'Token is empty or invalid (does not refer to valid logged in user session)',
      statusCode: 401,
    };
  }

  const user = getUser(tokenObject.authUserId);

  if (!user.quizzesOwned.find(quiz => quiz === quizId)) {
    return {
      error: 'Valid token is provided, but user is not an owner of this quiz',
      statusCode: 403,
    };
  }

  const index = data.trash.findIndex(quiz => quiz.quizId === quizId);

  if (index !== -1) {
    if (data.quizzes.find(quiz => quiz.name === data.trash[index].name)) {
      return {
        error: 'Quiz name of the restored quiz is already used by another active quiz',
        statusCode: 400,
      };
    }

    const deletedQuiz = data.trash.splice(index, 1)[0];
    data.quizzes.push(deletedQuiz);
  } else {
    return {
      error: 'Quiz ID refers to a quiz that is not currently in the trash',
      statusCode: 400,
    };
  }

  setData(data);

  return {};
};

/**
 * Permanently delete specific quizzes currently sitting in the trash
 *
 * @param {string} token - The ID of the current user session.
 * @param {string} quizIds - The ID of the quiz to be updated.
 * @returns {object} EmptyObject | ErrorObject
 */

export const adminQuizEmptyTrash = (token: string, quizIds: string): EmptyObject | ErrorObject => {
  const tokenObject = getToken(token);
  const data = getData();
  if (!tokenObject) {
    return {
      error: 'Token does not refer to valid logged in user session',
      statusCode: 401,
    };
  }

  const user = getUser(tokenObject.authUserId);
  const jsonArray = JSON.parse(quizIds);
  const numberIds = jsonArray.map(id => parseInt(id));

  for (const id of numberIds) {
    if (!user.quizzesOwned.find(quizId => quizId === id)) {
      return {
        error: 'Valid token is provided, but one or more of the Quiz IDs refers to a quiz that this current user does not own',
        statusCode: 403
      };
    }
    if (!data.trash.find(quiz => quiz.quizId === id)) {
      return {
        error: 'One or more of the Quiz IDs is not currently in the trash',
        statusCode: 400
      };
    }
  }
  for (const id of numberIds) {
    const indexOfQuizInTrash = data.trash.findIndex(quiz => quiz.quizId === id);
    data.trash.splice(indexOfQuizInTrash, 1);
    const indexOfQuizInQuizzesOwned = user.quizzesOwned.findIndex(quiz => quiz.quizId === id);
    user.quizzesOwned.splice(indexOfQuizInQuizzesOwned, 1);
  }
  setData(data);
  return {};
};

/**
 * Create a new stub question for a particular quiz.
 *
 * @param {number} quizid
 * @param {string} token
 * @param {object} questionBody
 * @returns {QuestionIdReturn | ErrorObject} QuestionIdReturn if the question is successfully created,
 * or an ErrorObject with details if the restoration encounters an error.
 */
export const adminQuizQuestionCreate = (quizid: number, token: string, questionBody: QuestionBody): QuestionIdReturn | ErrorObject => {
  const data = getData();
  const quiz = getQuiz(quizid);
  const findToken = getToken(token) as Token;

  if (!findToken) {
    return {
      error: 'Invalid token',
      statusCode: 401,
    };
  }

  const user = getUser(findToken.authUserId);
  const hasQuizId = user.quizzesOwned.find(quiz => quiz === quizid);
  const CorrectAnswer = questionBody.answers.some(ans => ans.correct === true);

  if (!hasQuizId) {
    return {
      error: 'Valid token is provided, but user is not an owner of this quiz',
      statusCode: 403,
    };
  } else if (questionBody.question.length < 5 || questionBody.question.length > 50) {
    return {
      error: 'Invalid question length',
      statusCode: 400,
    };
  } else if (questionBody.answers.length < 2 || questionBody.answers.length > 6) {
    return {
      error: 'The question has more than 6 answers or less than 2 answers',
      statusCode: 400,
    };
  } else if (questionBody.duration <= 0) {
    return {
      error: 'Question duration must be positive',
      statusCode: 400,
    };
  } else if (questionBody.duration + quiz.duration > 180) {
    return {
      error: 'Quiz duration cannot be longer than 3 minutes',
      statusCode: 400,
    };
  } else if (questionBody.points < 1 || questionBody.points > 10) {
    return {
      error: 'The points awarded for the question are less than 1 or greater than 10',
      statusCode: 400,
    };
  } else if (questionBody.answers.find(ans => ans.answer.length < 1 || ans.answer.length > 30)) {
    return {
      error: 'The length of an answer is shorter than 1 character long, or longer than 30 characters long',
      statusCode: 400,
    };
  } else if (!CorrectAnswer) {
    return {
      error: 'Question must have a correct answer',
      statusCode: 400,
    };
  }
  const seenAnswers: string[] = [];
  for (const answer of questionBody.answers) {
    if (seenAnswers.includes(answer.answer)) {
      return {
        error: 'Cannot have duplicate answers.',
        statusCode: 400,
      };
    }
    seenAnswers.push(answer.answer);
  }

  quiz.duration += questionBody.duration; // Update duration of quiz
  quiz.timeLastEdited = Math.floor((new Date()).getTime() / 1000); // Update timeLastEdited of quiz
  quiz.numQuestions += 1;

  const colourArray = ['red', 'blue', 'green', 'yellow', 'purple', 'brown', 'orange'];
  const newQuestionId = parseInt(generateCustomUuid('0123456789', 12));
  const answers: Answer[] = [];

  for (const answer of questionBody.answers) {
    const createAnswerId = parseInt(generateCustomUuid('0123456789', 10));
    const randomElement = Math.floor(Math.random() * colourArray.length);
    const newColour = colourArray[randomElement];
    const answerObject = {
      answerId: createAnswerId,
      answer: answer.answer,
      colour: newColour,
      correct: answer.correct,
    };
    answers.push(answerObject);
  }

  const newQuestion = {
    questionId: newQuestionId,
    question: questionBody.question,
    duration: questionBody.duration,
    points: questionBody.points,
    answers: answers,
  };

  quiz.questions.push(newQuestion);

  setData(data);

  return {
    questionId: newQuestionId
  };
};

/**
 * Move a question from one particular position in the quiz to another
 *
 * @param {string} token
 * @param {number} quizId
 * @param {number} questionId
 * @param {number} newPosition
 * @returns {object} EmptyObject | ErrorObject
 */
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
      error: 'NewPosition cannot be less than 0 or greater than n-1 where n is the number of questions',
      statusCode: 400,
    };
  }

  if (newPosition === curQuestionIds.indexOf(questionId)) {
    return {
      error: 'NewPosition cannot be the position of the current question',
      statusCode: 400,
    };
  }

  const initialIndex = curQuestionIds.indexOf(curQuestion.questionId);
  curQuestions.splice(initialIndex, 1);
  curQuestions.splice(newPosition, 0, curQuestion);
  curQuiz.timeLastEdited = Math.floor((new Date()).getTime() / 1000);
  setData(data);

  return {};
};

/**
 * Duplicates a question to immediately after where the source question is
 *
 * @param {string} token
 * @param {number} quizId
 * @param {number} questionId
 * @param {number} newPosition
 * @returns {object} QuestionDuplicateReturn | ErrorObject
 */
export const adminQuizQuestionDuplicate = (token: string, quizId: number, questionId: number): QuestionDuplicateReturn | ErrorObject => {
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

  const initialIndex = curQuestionIds.indexOf(curQuestion.questionId);
  const dupeQuestion = JSON.parse(JSON.stringify(curQuestion));
  dupeQuestion.questionId = parseInt(generateCustomUuid('0123456789', 12));
  curQuestions.splice(initialIndex + 1, 0, dupeQuestion);
  curQuiz.duration += dupeQuestion.duration;
  curQuiz.numQuestions += 1;
  curQuiz.timeLastEdited = Math.floor((new Date()).getTime() / 1000);
  setData(data);

  return {
    newQuestionId: dupeQuestion.questionId
  };
};

/**
 *
 * @param {string} token
 * @param {number} quizId
 * @param {string} userEmail
 * @returns {object} EmptyObject | ErrorObject
 */
export const adminQuizTransfer = (token: string, quizId: number, userEmail: string): EmptyObject | ErrorObject => {
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

  if (!curUser.quizzesOwned.includes(quizId)) {
    return {
      error: 'Quiz ID does not refer to a quiz that this user owns',
      statusCode: 403,
    };
  }

  const curQuiz = getQuiz(quizId);
  const getQuizByName = data.quizzes.find(quiz => quiz.name === curQuiz.name);
  const userToTransfer = getUserByEmail(userEmail);
  if (!userToTransfer) {
    return {
      error: 'userEmail is not a real user',
      statusCode: 400,
    };
  } else if (curUser.email === userEmail) {
    return {
      error: 'userEmail is the current logged in user',
      statusCode: 400,
    };
  } else if (userToTransfer.quizzesOwned.includes(getQuizByName.quizId)) {
    return {
      error: 'Quiz ID refers to a quiz that has a name that is already used by the target user',
      statusCode: 400,
    };
  }

  userToTransfer.quizzesOwned.push(quizId);

  const indexToRemove = curUser.quizzesOwned.indexOf(quizId);
  if (indexToRemove !== -1) {
    curUser.quizzesOwned.splice(indexToRemove, 1);
  }

  setData(data);
  return { };
};

/**
Update a quiz question by modifying its content and properties.*
@param {number} quizId - The unique identifier of the quiz containing the question to be updated.
@param {number} questionId - The unique identifier of the question to be updated.
@param {string} sessionId - The session ID of the user making the request.
@param {object} questionBody - An object containing the new question content and properties.
@param {string} questionBody.question - The updated question text.
@param {object[]} questionBody.answers - An array of answer objects.
@param {string} questionBody.answers.answer - The text of an answer option.
@param {boolean} questionBody.answers.correct - Indicates whether the answer is correct (true) or not (false).
@param {number} questionBody.duration - The updated duration for the question.
@param {number} questionBody.points - The updated number of points awarded for the question.
*
@returns {EmptyObject | ErrorObject} - An object representing the result of the update operation.
@returns {EmptyObject} - If the update is successful, an empty object is returned.
@returns {ErrorObject} - If any validation checks fail, an error object is returned with details.
*
@typedef {Object} EmptyObject - An empty object representing a successful operation.
@typedef {Object} ErrorObject - An object representing an error with a status code and message.
@property {string} error - A description of the error.
@property {string} status - The HTTP status code associated with the error.
*/
export const adminUpdateQuiz = (quizId: number, questionId: number, sessionId: string, questionBody: QuestionBody): EmptyObject | ErrorObject => {
  const data = getData();
  const quiz = getQuiz(quizId);
  const token = (getToken(sessionId));

  if (!token) {
    return {
      error: 'Token is empty or invalid (does not refer to valid logged in user session)',
      statusCode: 401,
    };
  }

  const user = getUser(token.authUserId);

  if (!user) {
    return {
      error: 'Token is empty or invalid (does not refer to valid logged in user session)',
      statusCode: 401,
    };
  }

  const question = quiz.questions.find(question => question.questionId === questionId);

  if (!quiz || !question) {
    return {
      error: 'Question Id does not refer to a valid question within this quiz',
      statusCode: 400,
    };
  }

  if (!user.quizzesOwned.find(quiz => quiz === quizId)) {
    return {
      error: 'Valid token is provided, but user is unauthorised to complete this action',
      statusCode: 403,
    };
  }

  if (questionBody.question.length < 5 || questionBody.question.length > 50) {
    return {
      error: 'Question Id does not refer to a valid question within this quiz',
      statusCode: 400,
    };
  }

  if (questionBody.answers.length < 2 || questionBody.answers.length > 6) {
    return {
      error: 'The question has more than 6 answers or less than 2 answers',
      statusCode: 400,
    };
  }

  if (questionBody.duration <= 0) {
    return {
      error: 'The question duration is not a positive number',
      statusCode: 400,
    };
  }

  let sum = 0;

  for (const question of quiz.questions) {
    sum += question.duration;
  }

  sum -= question.duration;
  sum += questionBody.duration;

  if (sum > 180) {
    return {
      error: 'If this question were to be updated, the sum of the question durations in the quiz exceeds 3 minutes',
      statusCode: 400,
    };
  }

  if (questionBody.points < 1 || questionBody.points > 10) {
    return {
      error: 'The points awarded for the question are less than 1 or greater than 10',
      statusCode: 400,
    };
  }

  if (questionBody.answers.find(answer => answer.answer.length < 1) || questionBody.answers.find(answer => answer.answer.length > 30)) {
    return {
      error: 'The length of any answer is shorter than 1 character long, or longer than 30 characters long',
      statusCode: 400,
    };
  }

  for (let i = 0; i < questionBody.answers.length; i++) {
    for (let j = i + 1; j < questionBody.answers.length; j++) {
      if (questionBody.answers[i].answer === questionBody.answers[j].answer) {
        return {
          error: 'Any answer strings are duplicates of one another (within the same question)',
          statusCode: 400,
        };
      }
    }
  }

  if (!questionBody.answers.find(answer => answer.correct === true)) {
    return {
      error: 'There are no correct answers',
      statusCode: 400,
    };
  }
  const colour = ['red', 'green', 'blue'];

  const answers: Answer[] = [];

  for (const index in questionBody.answers) {
    const pushObject: Answer = {
      answerId: Number(index),
      answer: questionBody.answers[index.answer],
      colour: colour[Math.floor(Math.random()) % 3],
      correct: questionBody.answers[index].correct,
    };
    answers.push(pushObject);
  }

  question.answers = answers;
  question.duration = questionBody.duration;
  question.points = questionBody.points;
  question.question = questionBody.question;

  quiz.timeLastEdited = Math.floor((new Date()).getTime() / 1000);
  setData(data);
  return {};
};
