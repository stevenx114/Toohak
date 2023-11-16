import {
  sessionState,
  ErrorObject,
  SessionIdReturn,
  SessionStatusViewReturn
} from './types';

import {
  getToken,
  getUser,
  getQuiz,
  getSession
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

export const adminQuizSessionStatusView = (token: string, quizId: number, sessionId: number): SessionStatusViewReturn | ErrorObject => {
   let session;
   let user;

  if (!(session = getSession(sessionId))) {
    throw HTTPError(400, "Session Id does not refer to a valid session within this quiz");
  } else if (!token) {
    throw HTTPError(401, 'Token is empty');
  } else if (!(user = getUser(getToken(token)?.authUserId))) {
    throw HTTPError(401, 'Token does not refer to valid logged in user session');
  } else if (!user.quizzesOwned.find(quiz => quiz === quizId)) {
    throw HTTPError(403, 'Valid token is provided, but user is not an owner of this quiz');
  }
 
  const result = JSON.parse(`{
    "state": "LOBBY",
    "atQuestion": 3,
    "players": [
      "Hayden"
    ],
    "metadata": {
      "quizId": 5546,
      "name": "This is the name of the quiz",
      "timeCreated": 1683019484,
      "timeLastEdited": 1683019484,
      "description": "This quiz is so we can have a lot of fun",
      "numQuestions": 1,
      "questions": [
        {
          "questionId": 5546,
          "question": "Who is the Monarch of England?",
          "duration": 4,
          "thumbnailUrl": "http://google.com/some/image/path.jpg",
          "points": 5,
          "answers": [
            {
              "answerId": 2384,
              "answer": "Prince Charles",
              "colour": "red",
              "correct": true
            }
          ]
        }
      ],
      "duration": 44,
      "thumbnailUrl": "http://google.com/some/image/path.jpg"
    }
  }`);
  
  return result;
};

