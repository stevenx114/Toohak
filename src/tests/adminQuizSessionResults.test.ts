import {
  QuizIdReturn,
  TokenReturn,
  SessionIdReturn,
  validDetails,
  sessionAction
} from '../types';

import {
  requestAuthRegister,
  requestClear,
  requestQuizCreateV2,
  requestQuizSessionStart,
  requestQuizSessionResults,
  requestSessionStateUpdate

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

  beforeEach(() => {
    user1 = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    user2 = requestAuthRegister(validDetails.EMAIL_2, validDetails.PASSWORD_2, validDetails.FIRST_NAME_2, validDetails.LAST_NAME_2);
    quizId1 = requestQuizCreateV2(user1.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
    quizId2 = requestQuizCreateV2(user2.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
    sessionId1 = requestQuizSessionStart(user1.token, quizId1.quizId, 3);
    sessionId2 = requestQuizSessionStart(user2.token, quizId2.quizId, 4);
    requestSessionStateUpdate(user1.token, quizId1.quizId, sessionId1.sessionId, sessionAction.GO_TO_FINAL_RESULTS);
    requestSessionStateUpdate(user2.token, quizId2.quizId, sessionId2.sessionId, sessionAction.GO_TO_FINAL_RESULTS);
  });

  describe('Success Cases', () => {
    test.skip('Returns correct object', () => {
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

  describe.skip('Error Cases', () => {
    test('Session Id does not refer to a valid session within this quiz', () => {
      expect(() => requestQuizSessionResults(user1.token, quizId1.quizId, sessionId1.sessionId + 1)).toThrow(HTTPError[400]);
    });

    test('Session is not in FINAL_RESULTS state', () => {
      requestSessionStateUpdate(user1.token, quizId1.quizId, sessionId1.sessionId, sessionAction.NEXT_QUESTION);
      expect(() => requestQuizSessionResults(user1.token, quizId1.quizId, sessionId1.sessionId)).toThrow(HTTPError[400]);
    });

    test('Token is empty', () => {
      expect(() => requestQuizSessionResults('', quizId1.quizId, sessionId1.sessionId)).toThrow(HTTPError[401]);
    });

    test('Token is invalid and does not refer to a valid login in user', () => {
      expect(() => requestQuizSessionResults(user1.token + 'a', quizId1.quizId, sessionId1.sessionId)).toThrow(HTTPError[401]);
    });

    test('Valid token is provided, but user is not an owner of this quiz', () => {
      expect(() => requestQuizSessionResults(user2.token, quizId1.quizId, sessionId2.sessionId)).toThrow(HTTPError[403]);
    });
  });
});
