import {
    QuizIdReturn,
    TokenReturn, SessionIdReturn, VALID_Q_BODY, sessionState, validDetails, sessionAction,
    PlayerIdReturn,
    SessionStatusViewReturn,
} from '../types';

import { 
    requestAuthRegister, 
    requestClear, 
    requestQuizCreateV2,
    requestQuizInfoV2, 
    requestQuizSessionStart,
    requestSessionStateUpdate,
    requestSessionStatus,
    requestPlayerStatus,
    requestPlayerJoin,
    requestQuizQuestionCreateV2

 } from './wrapper';
import HTTPError from 'http-errors';

beforeEach(() => {
    requestClear();
});

afterEach(() => {
    requestClear();
});

describe('GET /v1/player/:playerid', () => {
  let user: TokenReturn;
  let quizId: QuizIdReturn;
  let sessionId: SessionIdReturn;
  let playerId: PlayerIdReturn;
  let sessionInfo: SessionStatusViewReturn;
  
  beforeEach(() => {
    user = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    quizId = requestQuizCreateV2(user.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
    requestQuizQuestionCreateV2(user.token, quizId.quizId, VALID_Q_BODY);
    sessionId = requestQuizSessionStart(user.token, quizId.quizId, 1);
    playerId = requestPlayerJoin(sessionId.sessionId, `${validDetails.FIRST_NAME} ${validDetails.LAST_NAME}`);
});

  describe('Success Cases', () => {
    test('Returns correct object', () => {
    sessionInfo = requestSessionStatus(user.token, quizId.quizId, sessionId.sessionId);
    expect(requestPlayerStatus(playerId.playerId)).toStrictEqual( 
        {
            state: sessionInfo.state,
            numQuestions: sessionInfo.metadata.numQuestions,
            atQuestion: sessionInfo.atQuestion,
        }
    )
  });
});

  describe('Error Cases', () => {
    test('Player ID does not exist', () => {
        expect(() => requestPlayerStatus(playerId.playerId + 1)).toThrow(HTTPError[400]);
    });
  });
});