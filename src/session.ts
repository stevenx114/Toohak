import {
  sessionState,
  ErrorObject,
  SessionIdReturn,
  EmptyObject,
  SessionStatusViewReturn,
  sessionAction
} from './types';

import {
  getToken,
  getUser,
  getQuiz,
  getSession,
  isValidAction,
  getNextState
} from './helper';

import {
  getData,
  setData,
  Session
} from './dataStore';

import HTTPError from 'http-errors';

import {
  generateCustomUuid
} from 'custom-uuid';

/**
 * Start a new session for the quiz
 *
 * @param {string} token
 * @param {number} quizId
 * @param {number} autoStartNum
 * @returns {object} SessionIdReturn | ErrorObject
 */
export const adminQuizSessionStart = (token: string, quizId: number, autoStartNum: number): SessionIdReturn | ErrorObject => {
  const data = getData();
  const curToken = getToken(token);
  if (!curToken) {
    throw HTTPError(401, 'Token does not refer to valid logged in user session');
  }
  const curUserId = curToken.authUserId;
  const curUser = getUser(curUserId);
  const numActiveSessions = data.sessions.filter(session => session.state !== sessionState.END).length;

  if (autoStartNum > 50) {
    throw HTTPError(400, 'autoStartNum cannot be greater than 50');
  } else if (numActiveSessions >= 10) {
    throw HTTPError(400, 'You can only have a maximum of 10 active sessions for this quiz');
  } else if (getQuiz(quizId).numQuestions === 0) {
    throw HTTPError(400, 'The quiz must have at least 1 question');
  } else if (!curUser.quizzesOwned.includes(quizId)) {
    throw HTTPError(403, 'Quiz ID does not refer to a quiz that this user owns');
  }

  const newSessionId = parseInt(generateCustomUuid('0123456789', 12));
  const newSession: Session = {
    sessionId: newSessionId,
    quizId: quizId,
    atQuestion: 0,
    state: sessionState.LOBBY,
    numPlayers: 0,
    players: [],
    autoStartNum: autoStartNum
  };
  data.sessions.push(newSession);
  setData(data);

  return {
    sessionId: newSessionId
  };
};

/**
 * Update the state of a particular session by sending an action command
 *
 * @param {string} token
 * @param {number} quizId
 * @param {number} sessionId
 * @param {string} action
 * @returns {object} EmptyObject | ErrorObject
 */
export const adminQuizSessionStateUpdate = (token: string, quizId: number, sessionId: number, action: string): EmptyObject | ErrorObject => {
  const data = getData();
  const curToken = getToken(token);
  if (!curToken) {
    throw HTTPError(401, 'Token does not refer to valid logged in user session');
  }
  const curUserId = curToken.authUserId;
  const curUser = getUser(curUserId);
  const curSession = getSession(sessionId);
  const curState = curSession.state;

  if (!curUser.quizzesOwned.includes(quizId)) {
    throw HTTPError(403, 'Quiz ID does not refer to a quiz that this user owns');
  } else if (curSession.quizId !== quizId) {
    throw HTTPError(400, 'Session Id does not refer to a valid session within this quiz');
  } else if (!(action in sessionAction)) {
    throw HTTPError(400, 'Action provided is not a valid Action');
  } else if (!isValidAction(curState, action)) {
    throw HTTPError(400, 'Action cannot be run in the current state');
  }

  const curQuiz = getQuiz(quizId);
  const atQuestionIndex = curSession.atQuestion;
  const nextQuestion = curQuiz.questions[atQuestionIndex];
  const questionDuration = nextQuestion.duration;
  curSession.state = getNextState(sessionId, curState, action, questionDuration);
  setData(data);

  return {};
};

/**
 * Retrieves the status of a quiz session for an admin user.
 *
 * @param {string} token - The authentication token.
 * @param {number} quizId - The ID of the quiz.
 * @param {number} sessionId - The ID of the quiz session.
 * @throws {ErrorObject} Throws an error if any validation fails.
 * @returns {SessionStatusViewReturn} Returns the status of the quiz session.
 */
export const adminQuizSessionStatusView = (token: string, quizId: number, sessionId: number): SessionStatusViewReturn | ErrorObject => {
  let session;
  let user;
  const quiz = getQuiz(quizId);
  if (!(session = getSession(sessionId))) {
    throw HTTPError(400, 'Session Id does not refer to a valid session within this quiz');
  } else if (!token) {
    throw HTTPError(401, 'Token is empty');
  } else if (!(user = getUser(getToken(token)?.authUserId))) {
    throw HTTPError(401, 'Token does not refer to valid logged in user session');
  } else if (!user.quizzesOwned.find(quiz => quiz === quizId)) {
    throw HTTPError(403, 'Valid token is provided, but user is not an owner of this quiz');
  }

  const quizObject = {
    state: session.state,
    atQuestion: session.atQuestion,
    players: session.players,
    metadata: quiz,
  };

  return quizObject;
};
