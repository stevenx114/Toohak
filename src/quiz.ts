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
  ErrorObject,
  QuizIdReturn,
  QuizListReturn,
  EmptyObject,
  trashedQuizReturn,
  QuestionBody,
  QuestionIdReturn
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
    questions: quiz.questions
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
