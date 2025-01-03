import {
  getData,
  setData,
  Quiz,
  Token,
  Answer
} from './dataStore';

import validator from 'validator';

import HTTPError from 'http-errors';

import {
  generateCustomUuid
} from 'custom-uuid';

import {
  ErrorObject,
  QuizIdReturn,
  QuizListReturn,
  EmptyObject,
  trashedQuizReturn,
  QuestionBody,
  QuestionIdReturn,
  QuestionDuplicateReturn,
  sessionState
} from './types';

import {
  getUser,
  getToken,
  getQuiz,
  getQuestion,
  getUserByEmail
} from './helper';

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

  if (!token) {
    throw HTTPError(401, 'Token is empty');
  }

  if (!curToken) {
    throw HTTPError(401, 'Token does not refer to valid logged in user session');
  }
  const curUserId = curToken.authUserId;
  const curUser = getUser(curUserId);
  const curQuizzes = data.quizzes.filter(quiz => curUser.quizzesOwned.includes(quiz.quizId));
  const curQuizzesNames = curQuizzes.map(quiz => quiz.name);
  const newQuizId = parseInt(generateCustomUuid('0123456789', 12));

  if (!name) {
    throw HTTPError(400, 'name cannot be empty');
  } else if (name.length < 3) {
    throw HTTPError(400, 'name needs to be at least 3 characters');
  } else if (name.length > 30) {
    throw HTTPError(400, 'name cannot exceed 30 characters');
  } else if (description.length > 100) {
    throw HTTPError(400, 'description cannot exceed 100 characters');
  } else if (specialChar.test(name)) {
    throw HTTPError(400, 'name can only contain alphanumeric and space characters');
  } else if (curQuizzesNames.includes(name)) {
    throw HTTPError(400, 'Name is already used by the current logged in user for another quiz');
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
      duration: 0,
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
    throw HTTPError(401, 'Token does not refer to valid logged in user session');
  }
  const userId = curToken.authUserId;
  const user = getUser(userId);

  if (!user.quizzesOwned.includes(quizId)) {
    throw HTTPError(403, 'Quiz ID does not refer to a quiz that this user owns');
  }
  const activeSessions = data.sessions.filter(s => s.quizId === quizId);
  if (activeSessions.find(s => s.state !== sessionState.END)) {
    throw HTTPError(400, 'All sessions for this quiz in END state');
  }
  const indexOfQuizInData = data.quizzes.findIndex(quiz => quiz.quizId === quizId);
  data.quizzes[indexOfQuizInData].timeLastEdited = Math.floor((new Date()).getTime() / 1000);
  data.trash.push(data.quizzes[indexOfQuizInData]);
  data.quizzes.splice(indexOfQuizInData, 1);

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
    throw HTTPError(401, 'Token does not refer to valid logged in user session');
  }
  const quiz = getQuiz(quizId);

  const userId = curToken.authUserId;
  const curUser = getUser(userId);
  if (!curUser.quizzesOwned.includes(quizId)) {
    throw HTTPError(403, 'Quiz ID does not refer to a quiz that this user owns');
  }

  if (quiz.thumbnailUrl !== undefined) {
    return {
      quizId: quiz.quizId,
      name: quiz.name,
      timeCreated: quiz.timeCreated,
      timeLastEdited: quiz.timeLastEdited,
      description: quiz.description,
      numQuestions: quiz.numQuestions,
      questions: quiz.questions,
      duration: quiz.duration,
      thumbnailUrl: quiz.thumbnailUrl
    };
  } else {
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
  }
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
    throw HTTPError(401, 'Token does not refer to valid logged in user session');
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
    throw HTTPError(401, 'Token does not refer to valid logged in user session');
  }

  const curUserId = curToken.authUserId;
  const curUser = getUser(curUserId);
  const curQuizzes = data.quizzes.filter(quiz => curUser.quizzesOwned.includes(quiz.quizId));
  const curQuizzesNames = curQuizzes.map(quiz => quiz.name);
  if (!validator.isAlphanumeric(name.replace(/\s/g, ''))) {
    throw HTTPError(400, 'Name contains invalid characters. Valid characters are alphanumeric and spaces');
  }

  if (name.length < 3 || name.length > 30) {
    throw HTTPError(400, 'Name is either less than 3 characters long or more than 30 characters long');
  }

  if (curQuizzesNames.includes(name)) {
    throw HTTPError(400, 'Name is already used by the current logged in user for another quiz');
  }

  if (!curUser.quizzesOwned.includes(quizId)) {
    throw HTTPError(403, 'Quiz ID does not refer to a quiz that this user owns');
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
    throw HTTPError(401, 'Token does not refer to valid logged in user session');
  }
  if (description.length > 100) {
    throw HTTPError(400, 'Description is more than 100 characters in length');
  }
  const userId = curToken.authUserId;
  const user = getUser(userId);
  const quiz = getQuiz(quizId);

  const doesUserOwnQuiz = user.quizzesOwned.includes(quizId);

  if (doesUserOwnQuiz === false) {
    throw HTTPError(403, 'Quiz ID does not refer to a quiz that this user owns');
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
    throw HTTPError(401, 'Token is empty or invalid (does not refer to valid logged in user session)');
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
    throw HTTPError(401, 'Token is empty or invalid (does not refer to valid logged in user session)');
  }

  const user = getUser(tokenObject.authUserId);

  if (!user.quizzesOwned.find(quiz => quiz === quizId)) {
    throw HTTPError(403, 'Valid token is provided, but user is not an owner of this quiz');
  }

  const index = data.trash.findIndex(quiz => quiz.quizId === quizId);

  if (index !== -1) {
    if (data.quizzes.find(quiz => quiz.name === data.trash[index].name)) {
      throw HTTPError(400, 'Quiz name of the restored quiz is already used by another active quiz');
    }

    const deletedQuiz = data.trash.splice(index, 1)[0];
    data.quizzes.push(deletedQuiz);
  } else {
    throw HTTPError(400, 'Quiz ID refers to a quiz that is not currently in the trash');
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
    throw HTTPError(401, 'Token does not refer to valid logged in user session');
  }

  const user = getUser(tokenObject.authUserId);
  const jsonArray = JSON.parse(quizIds);
  const numberIds = jsonArray.map(id => parseInt(id));

  for (const id of numberIds) {
    if (!user.quizzesOwned.find(quizId => quizId === id)) {
      throw HTTPError(403, 'Valid token is provided, but one or more of the Quiz IDs refers to a quiz that this current user does not own');
    }
    if (!data.trash.find(quiz => quiz.quizId === id)) {
      throw HTTPError(400, 'One or more of the Quiz IDs is not currently in the trash');
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
    throw HTTPError(401, 'Invalid token');
  }

  const user = getUser(findToken.authUserId);
  const hasQuizId = user.quizzesOwned.find(quiz => quiz === quizid);
  const CorrectAnswer = questionBody.answers.some(ans => ans.correct === true);

  if (!hasQuizId) {
    throw HTTPError(403, 'Valid token is provided, but user is not an owner of this quiz');
  } else if (questionBody.question.length < 5 || questionBody.question.length > 50) {
    throw HTTPError(400, 'Invalid question length');
  } else if (questionBody.answers.length < 2 || questionBody.answers.length > 6) {
    throw HTTPError(400, 'The question has more than 6 answers or less than 2 answers');
  } else if (questionBody.duration <= 0) {
    throw HTTPError(400, 'Question duration must be positive');
  } else if (questionBody.duration + quiz.duration > 180) {
    throw HTTPError(400, 'Quiz duration cannot be longer than 3 minutes');
  } else if (questionBody.points < 1 || questionBody.points > 10) {
    throw HTTPError(400, 'The points awarded for the question are less than 1 or greater than 10');
  } else if (questionBody.answers.find(ans => ans.answer.length < 1 || ans.answer.length > 30)) {
    throw HTTPError(400, 'The length of an answer is shorter than 1 character long, or longer than 30 characters long');
  } else if (!CorrectAnswer) {
    throw HTTPError(400, 'Question must have a correct answer');
  } else if (questionBody.thumbnailUrl === '') {
    throw HTTPError(400, 'Thumbnail URL cannot be empty');
  }

  if (questionBody.thumbnailUrl) {
    if (!questionBody.thumbnailUrl.endsWith('.png') && !questionBody.thumbnailUrl.endsWith('jpeg') && !questionBody.thumbnailUrl.endsWith('.jpg')) {
      throw HTTPError(400, 'Incorrect file type');
    }

    if (questionBody.thumbnailUrl.startsWith('http://') === false && questionBody.thumbnailUrl.startsWith('https://') === false) {
      throw HTTPError(400, 'Invalid Thumbnail URL');
    }
  }

  const seenAnswers: string[] = [];
  for (const answer of questionBody.answers) {
    if (seenAnswers.includes(answer.answer)) {
      throw HTTPError(400, 'Cannot have duplicate answers');
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
    thumbnailUrl: questionBody.thumbnailUrl,
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
    throw HTTPError(401, 'Token does not refer to valid logged in user session');
  }

  const curUserId = curToken.authUserId;
  const curUser = getUser(curUserId);
  const curQuiz = getQuiz(quizId);
  const curQuestion = getQuestion(quizId, questionId);
  const curQuestions = curQuiz.questions;
  const curQuestionIds = curQuestions.map(q => q.questionId);
  if (!curUser.quizzesOwned.includes(quizId)) {
    throw HTTPError(403, 'Quiz ID does not refer to a quiz that this user owns');
  }

  if (!curQuestionIds.includes(questionId)) {
    throw HTTPError(400, 'Question Id does not refer to a valid question within this quiz');
  }

  if (newPosition < 0 || newPosition > curQuiz.numQuestions - 1) {
    throw HTTPError(400, 'NewPosition cannot be less than 0 or greater than n-1 where n is the number of questions');
  }

  if (newPosition === curQuestionIds.indexOf(questionId)) {
    throw HTTPError(400, 'NewPosition cannot be the position of the current question');
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
    throw HTTPError(401, 'Token does not refer to valid logged in user session');
  }

  const curUserId = curToken.authUserId;
  const curUser = getUser(curUserId);
  const curQuiz = getQuiz(quizId);
  const curQuestion = getQuestion(quizId, questionId);
  const curQuestions = curQuiz.questions;
  const curQuestionIds = curQuestions.map(q => q.questionId);
  if (!curUser.quizzesOwned.includes(quizId)) {
    throw HTTPError(403, 'Quiz ID does not refer to a quiz that this user owns');
  }

  if (!curQuestionIds.includes(questionId)) {
    throw HTTPError(400, 'Question Id does not refer to a valid question within this quiz');
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
    throw HTTPError(401, 'Token does not refer to valid logged in user session');
  }

  const userId = curToken.authUserId;
  const curUser = getUser(userId);

  if (!curUser.quizzesOwned.includes(quizId)) {
    throw HTTPError(403, 'Quiz ID does not refer to a quiz that this user owns');
  }

  const curQuiz = getQuiz(quizId);
  const getQuizByName = data.quizzes.find(quiz => quiz.name === curQuiz.name);
  const userToTransfer = getUserByEmail(userEmail);
  if (!userToTransfer) {
    throw HTTPError(400, 'userEmail is not a real user');
  } else if (curUser.email === userEmail) {
    throw HTTPError(400, 'userEmail is the current logged in user');
  } else if (userToTransfer.quizzesOwned.includes(getQuizByName.quizId)) {
    throw HTTPError(400, 'Quiz ID refers to a quiz that has a name that is already used by the target user');
  }

  userToTransfer.quizzesOwned.push(quizId);

  const indexToRemove = curUser.quizzesOwned.indexOf(quizId);
  curUser.quizzesOwned.splice(indexToRemove, 1);

  setData(data);
  return { };
};

/**
 *
 * @param {number} quizId
 * @param {number} questionId
 * @param {string} token
 * @returns
 */
export const adminQuizQuestionDelete = (quizId: number, questionId: number, token: string): ErrorObject | Record<string, never> => {
  const data = getData();
  const quiz = getQuiz(quizId);
  const curToken = getToken(token);
  if (!curToken) {
    throw HTTPError(401, 'Invalid token');
  }

  const user = getUser(curToken.authUserId);
  if (!user.quizzesOwned.includes(quiz.quizId)) {
    throw HTTPError(403, 'User is not the owner of the quiz');
  }

  const question = quiz.questions.find(question => question.questionId === questionId);
  if (!question) {
    throw HTTPError(400, 'Invalid question id');
  }

  for (const session of data.sessions) {
    if (session.quizId === quizId && session.state !== 'END') {
      throw HTTPError(400, 'Session must be in END state');
    }
  }

  quiz.numQuestions--;
  quiz.questions = quiz.questions.filter(question => question.questionId !== questionId);
  quiz.duration -= question.duration;

  setData(data);
  return {};
};

/**
 * Updates a quiz question and its properties
 * @param {number} quizId
 * @param {number} questionId
 * @param {number} sessionId
 * @param {QuestionBody} questionBody
 * @returns {Object} EmptyObject | Error Object
 */
export const adminUpdateQuiz = (quizId: number, questionId: number, sessionId: string, questionBody: QuestionBody): EmptyObject | ErrorObject => {
  const data = getData();
  const quiz = getQuiz(quizId);
  const token = (getToken(sessionId));

  if (!token) {
    throw HTTPError(401, 'Token is empty or invalid (does not refer to valid logged in user session)');
  }

  const user = getUser(token.authUserId);
  const question = quiz.questions.find(question => question.questionId === questionId);

  if (!quiz || !question) {
    throw HTTPError(400, 'Question Id does not refer to a valid question within this quiz');
  }

  if (!user.quizzesOwned.find(quiz => quiz === quizId)) {
    throw HTTPError(403, 'Valid token is provided, but user is unauthorised to complete this action');
  }

  if (questionBody.question.length < 5 || questionBody.question.length > 50) {
    throw HTTPError(400, 'Question ID does not refer to a valid question within this quiz');
  }

  if (questionBody.answers.length < 2 || questionBody.answers.length > 6) {
    throw HTTPError(400, 'The question has more than 6 answers or less than 2 answers');
  }

  if (questionBody.duration <= 0) {
    throw HTTPError(400, 'The question duration is not a positive number');
  }

  let newDuration = quiz.duration;
  newDuration -= question.duration;
  newDuration += questionBody.duration;

  if (newDuration > 180) {
    throw HTTPError(400, 'If this question were to be updated, the sum of the question durations in the quiz exceeds 3 minutes');
  }

  if (questionBody.points < 1 || questionBody.points > 10) {
    throw HTTPError(400, 'The points awarded for the quesiton are less than 1 or greater than 10');
  }

  if (questionBody.answers.find(answer => answer.answer.length < 1) || questionBody.answers.find(answer => answer.answer.length > 30)) {
    throw HTTPError(400, 'The length of any answer is shorter than 1 character long, or longer than 30 characters long');
  }

  for (let i = 0; i < questionBody.answers.length; i++) {
    for (let j = i + 1; j < questionBody.answers.length; j++) {
      if (questionBody.answers[i].answer === questionBody.answers[j].answer) {
        throw HTTPError(400, 'Any answer strings are duplicates of one another (within the same question)');
      }
    }
  }

  if (!questionBody.answers.find(answer => answer.correct === true)) {
    throw HTTPError(400, 'There are no correct answers');
  }

  if (questionBody.thumbnailUrl === '') {
    throw HTTPError(400, 'Thumbnail URL cannot be empty');
  }

  if (questionBody.thumbnailUrl) {
    if (!questionBody.thumbnailUrl.endsWith('.png') && !questionBody.thumbnailUrl.endsWith('jpeg') && !questionBody.thumbnailUrl.endsWith('.jpg')) {
      throw HTTPError(400, 'Incorrect file type');
    }

    if (questionBody.thumbnailUrl.startsWith('http://') === false && questionBody.thumbnailUrl.startsWith('https://') === false) {
      throw HTTPError(400, 'Invalid Thumbnail URL');
    }
  }

  const colour = ['red', 'blue', 'green', 'yellow', 'purple', 'brown', 'orange'];
  const answers: Answer[] = [];

  for (const index in questionBody.answers) {
    const pushObject: Answer = {
      answerId: Number(index),
      answer: questionBody.answers[index.answer],
      colour: colour[Math.floor(Math.random() * colour.length)],
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

/**
 * Update the thumbnail for the quiz
 *
 * @param {string} token
 * @param {number} quizId
 * @param {string} imgUrl
 * @returns {Object} EmptyObject | ErrorObject
 */
export const adminQuizThumbnailUpdate = (token: string, quizId: number, imgUrl: string): EmptyObject | ErrorObject => {
  const data = getData();
  const curQuiz = getQuiz(quizId);
  const curToken = getToken(token);
  if (!curToken) {
    throw HTTPError(401, 'Token does not refer to valid logged in user session');
  }
  const curUser = getUser(curToken.authUserId);
  const validFileTypeRegex = /\.(jpg|jpeg|png)$/i;
  const validProtocolRegex = /^(http:\/\/|https:\/\/)/;
  if (!curUser.quizzesOwned.includes(quizId)) {
    throw HTTPError(403, 'Quiz ID does not refer to a quiz that this user owns');
  } else if (!validFileTypeRegex.test(imgUrl)) {
    throw HTTPError(400, 'The image must have one of the following filetypes: jpg, jpeg, png');
  } else if (!validProtocolRegex.test(imgUrl)) {
    throw HTTPError(400, 'The imgUrl must begin with http:// or https://');
  }

  curQuiz.thumbnailUrl = imgUrl;
  curQuiz.timeLastEdited = Math.floor((new Date()).getTime() / 1000);
  setData(data);

  return {};
};
