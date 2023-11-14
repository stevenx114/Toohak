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
    SessionList,
    sessions
  } from './types';

/**
 * 
 * @param quizId 
 * @param token 
 * @returns 
 */
export const adminQuizSessionView = (quizId: number, token: string): SessionList | ErrorObject => {
  const data = getData();
  const quiz = getQuiz(quizId);
  const findToken = getToken(token) as Token;
  
  if (!token) {
    throw HTTPError(401, 'Token is empty');
  } 

  if (!findToken) {
    throw HTTPError(401, 'Invalid token');
  } 

  const user = getUser(findToken.authUserId);
  const hasQuizId = user.quizzesOwned.find(quiz => quiz === quizId);

  if (!hasQuizId) {
    throw HTTPError(403, 'Valid token is provided, but user is not an owner of this quiz');
  }
  
  const viewSessionList = {
    activeSessions: [],
    inactiveSessions: [],
  }

  for (const session of sessions) {
    if (session.quizId === quizId) {
      if (session.state === 'END') {
        viewSessionList.inactiveSessions.push(session.sessionId);
      } else {
        viewSessionList.activeSessions.push(session.sessionId);
      }
    }
  }

  return viewSessionList;
};
