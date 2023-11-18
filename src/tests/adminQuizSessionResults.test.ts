import {
  QuizIdReturn,
  TokenReturn,
  SessionIdReturn,
  validDetails,
  sessionAction,
  VALID_Q_BODY,
  VALID_Q_BODY_1,
  SessionStatusViewReturn,
  PlayerIdReturn
} from '../types';

import {
  requestAuthRegister,
  requestClear,
  requestQuizCreateV2,
  requestQuizSessionStart,
  requestQuizSessionResults,
  requestSessionStateUpdate,
  requestQuizQuestionCreateV2,
  requestSessionStatus,
  requestPlayerJoin,
} from './wrapper';
import HTTPError from 'http-errors';

beforeEach(() => {
  requestClear();
});

afterEach(() => {
  requestClear();
});

describe('GET /v1/admin/quiz/:quizid/session/:sessionid/results', () => {
  let user1: TokenReturn;
  let user2: TokenReturn;
  let quizId1: QuizIdReturn;
  let quizId2: QuizIdReturn;
  let sessionId1: SessionIdReturn;
  let sessionId2: SessionIdReturn;
  let playerId1: PlayerIdReturn;
  let playerId2: PlayerIdReturn;
  let sessionInfo: SessionStatusViewReturn;


  beforeEach(() => {
    user1 = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    quizId1 = requestQuizCreateV2(user1.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
    requestQuizQuestionCreateV2(user1.token, quizId1.quizId, VALID_Q_BODY);
    requestQuizQuestionCreateV2(user1.token, quizId1.quizId, VALID_Q_BODY_1);
    sessionId1 = requestQuizSessionStart(user1.token, quizId1.quizId, 1);
    playerId1 = requestPlayerJoin(sessionId1.sessionId, 'bye');
    requestSessionStateUpdate(user1.token, quizId1.quizId, sessionId1.sessionId, sessionAction.NEXT_QUESTION);
    requestSessionStateUpdate(user1.token, quizId1.quizId, sessionId1.sessionId, sessionAction.SKIP_COUNTDOWN);
   
    
    requestSessionStateUpdate(user1.token, quizId1.quizId, sessionId1.sessionId, sessionAction.GO_TO_ANSWER);
    sessionInfo = requestSessionStatus(user1.token, quizId1.quizId, sessionId1.sessionId);
    expect(requestSessionStateUpdate(user1.token, quizId1.quizId, sessionId1.sessionId, sessionAction.GO_TO_FINAL_RESULTS)).toStrictEqual({});
    
  });

  describe('Success Cases', () => {
    test('Returns correct object', () => {
      sessionInfo = requestSessionStatus(user1.token, quizId1.quizId, sessionId1.sessionId);
      expect(requestQuizSessionResults(user1.token, quizId1.quizId, sessionId1.sessionId)).toStrictEqual(
        {

          usersRankedByScore: [
            {
              name: expect.any(String),
              score: expect.any(Number)
            }
          ],
          questionResults: [
            {
              questionId: expect.any(Number),
              playersCorrectList: expect.arrayContaining([expect.any(String)]),
              averageAnswerTime: expect.any(Number),
              percentCorrect: expect.any(Number)
            }
          ]
        }
      );
    });
  });

  describe('Error Cases', () => {
    test('Session Id does not refer to a valid session within this quiz', () => {
      expect(() => requestQuizSessionResults(user1.token, quizId1.quizId, sessionId1.sessionId + 1)).toThrow(HTTPError[400]);
    });

    test('Session is not in FINAL_RESULTS state', () => {
      requestSessionStateUpdate(user1.token, quizId1.quizId, sessionId1.sessionId, sessionAction.END);
      expect(() => requestQuizSessionResults(user1.token, quizId1.quizId, sessionId1.sessionId)).toThrow(HTTPError[400]);
    });

    test('Token is empty', () => {
      expect(() => requestQuizSessionResults('', quizId1.quizId, sessionId1.sessionId)).toThrow(HTTPError[401]);
    });

    test('Token is invalid and does not refer to a valid login in user', () => {
      expect(() => requestQuizSessionResults(user1.token + 'a', quizId1.quizId, sessionId1.sessionId)).toThrow(HTTPError[401]);
    });

    test('Valid token is provided, but user is not an owner of this quiz', () => {
      expect(() => requestQuizSessionResults(user1.token, quizId1.quizId + 1, sessionId1.sessionId)).toThrow(HTTPError[403]);
    });
  });
});
