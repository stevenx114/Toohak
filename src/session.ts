import {
  sessionState,
  ErrorObject,
  SessionIdReturn,
  EmptyObject,
  SessionStatusViewReturn,
  sessionAction,
  SessionList
} from './types';

import {
  getToken,
  getUser,
  getQuiz,
  getSession,
  isValidAction,
  getNextState,
  getPlayer,
  getSessionByPlayerId,
  getRankByAnswerTime
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

  const curQuiz = getQuiz(quizId);
  const quizCopy = JSON.parse(JSON.stringify(curQuiz));
  const newSessionId = parseInt(generateCustomUuid('0123456789', 12));
  const newSession: Session = {
    sessionId: newSessionId,
    quizId: quizId,
    quiz: quizCopy,
    atQuestion: 0,
    state: sessionState.LOBBY,
    numPlayers: 0,
    players: [],
    autoStartNum: autoStartNum,
    chat: []
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

  curSession.state = getNextState(sessionId, curState, action);
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
    metadata: session.quiz,
  };

  return quizObject;
};

/**
 * Retrieves active and inactive session ids (sorted in ascending order) for a quiz
 *
 * @param {number} quizId
 * @param {string} token
 * @returns {Object} SessionList | ErrorObject
 */
export const adminQuizSessionView = (quizId: number, token: string): SessionList | ErrorObject => {
  const data = getData();
  const findToken = getToken(token);

  if (!findToken) {
    throw HTTPError(401, 'Invalid token');
  }

  const user = getUser(findToken.authUserId);
  if (!user.quizzesOwned.includes(quizId)) {
    throw HTTPError(403, 'Valid token is provided, but user is not an owner of this quiz');
  }

  const viewSessionList = {
    activeSessions: [],
    inactiveSessions: [],
  };

  const validSessions = data.sessions.filter(s => s.quizId === quizId);
  validSessions.sort((session1, session2) => session1.sessionId - session2.sessionId);
  viewSessionList.inactiveSessions = validSessions.filter(s => s.state === sessionState.END).map(s => s.sessionId);
  viewSessionList.activeSessions = validSessions.filter(s => s.state !== sessionState.END).map(s => s.sessionId);

  return viewSessionList;
};

/**
 * Submits Answers for a session
 *
 * @param {number} playerId
 * @param {number} questionPosition
 * @param {Array<number>} answerIds
 * @returns {object} EmptyObject | ErrorObject
 */
export const sessionQuizAnswer = (playerId: number, questionPosition: number, answerIds: number[]): EmptyObject | ErrorObject => {
  const session = getSessionByPlayerId(playerId);
  const quiz = session?.quiz;
  const question = quiz?.questions[questionPosition - 1];
  const player = getPlayer(playerId);

  if (session?.state !== sessionState.QUESTION_OPEN) {
    throw HTTPError(400, 'Session is not in QUESTION_OPEN state');
  } else if (questionPosition !== session.atQuestion) {
    throw HTTPError(400, 'If question position is not valid for the session this player is in or session is not yet up to this question');
  } else if ((new Set(answerIds).size < answerIds?.length)) {
    throw HTTPError(400, 'There are duplicate answer IDs provided');
  } else if (answerIds.length < 1) {
    throw HTTPError(400, 'Less than 1 answer ID was submitted');
  }

  if (!player.questionsCorrect) {
    player.questionsCorrect = [];
  }

  if (!player.answerTime) {
    player.answerTime = [];
  }

  for (const id of answerIds) {
    if (!question.answers.find(answer => answer.answerId === id)) {
      throw HTTPError(400, 'Answer IDs are not valid for this particular question');
    }
  }

  // Consider Multiple correct Answer Questions
  for (const correctAnswer of question.answers) {
    player.answerTime[questionPosition - 1] = Math.floor(((new Date()).getTime() - session.questionStartTime) / 1000);
    if (correctAnswer.correct && !answerIds.includes(correctAnswer.answerId)) {
      return {};
    }
  }

  for (const id of answerIds) {
    const currAnswer = question.answers.find(answer => answer.answerId === id);

    // Previously Correct
    if (player.questionsCorrect[questionPosition - 1] === true) {
      if (!currAnswer.correct) {
        player.questionsCorrect[questionPosition - 1] = false;
        player.score -= question.points * (1 / getRankByAnswerTime(session.players, player, questionPosition));
      }
    } else {
      if (currAnswer.correct) {
        player.questionsCorrect[questionPosition - 1] = true;
        player.score += question.points * (1 / getRankByAnswerTime(session.players, player, questionPosition));
      } else {
        player.questionsCorrect[questionPosition - 1] = false;
      }
    }

    player.answerTime[questionPosition - 1] = Math.floor(((new Date()).getTime() - session.questionStartTime) / 1000);
  }

  return {};
};
