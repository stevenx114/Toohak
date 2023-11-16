import {
  validDetails,
  QuizIdReturn,
  TokenReturn,
} from '../types';

import {
  requestAuthRegister,
  requestQuizCreate,
  requestClear,
  requestQuizRemoveV2,
  requestQuizList,
  requestQuizSessionStart
} from './wrapper';

import HTTPError from 'http-errors';

afterEach(() => {
  requestClear();
});

const autoStart = 3;

// Tests for adminQuizRemove function
describe('DELETE /v1/admin/quiz/{quizid}', () => {
  let ownsQuizUserToken: TokenReturn;
  let noQuizUserToken: TokenReturn;
  let quizOneId: QuizIdReturn;
  let quizTwoId: QuizIdReturn;
  beforeEach(() => {
    requestClear();
    ownsQuizUserToken = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    noQuizUserToken = requestAuthRegister(validDetails.EMAIL_2, validDetails.PASSWORD_2, validDetails.FIRST_NAME_2, validDetails.LAST_NAME_2);
    quizOneId = requestQuizCreate(ownsQuizUserToken.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
    quizTwoId = requestQuizCreate(ownsQuizUserToken.token, validDetails.QUIZ_NAME_2, validDetails.DESCRIPTION_2);
  });
  describe('Success cases', () => {
    test('Successful removal of quiz one', () => {
      requestQuizRemoveV2(ownsQuizUserToken.token, quizOneId.quizId);
      expect(requestQuizList(ownsQuizUserToken.token)).toStrictEqual({
        quizzes: [
          {
            quizId: quizTwoId.quizId,
            name: validDetails.QUIZ_NAME_2
          }
        ]
      });
    });
    test('Successful removal of quiz two', () => {
      expect(requestQuizRemoveV2(ownsQuizUserToken.token, quizTwoId.quizId)).toEqual({});
      expect(requestQuizList(ownsQuizUserToken.token)).toStrictEqual({
        quizzes: [
          {
            quizId: quizOneId.quizId,
            name: validDetails.QUIZ_NAME
          }
        ]
      });
    });
  });
  describe('Error Cases', () => {
    test('Token is empty', () => {
      expect(() => requestQuizRemoveV2('', quizOneId.quizId)).toThrow(HTTPError[401]);
    });
    test('Token is invalid', () => {
      expect(() => requestQuizRemoveV2(ownsQuizUserToken.token + '1', quizOneId.quizId)).toThrow(HTTPError[401]);
    });
    test('Quiz Id does not refer to a quiz that this user owns', () => {
      expect(() => requestQuizRemoveV2(noQuizUserToken.token, quizOneId.quizId)).toThrow(HTTPError[403]);
    });
    test('All sessions for this quiz must be in END state', () => {
      const sessionIdOne = requestQuizSessionStart(ownsQuizUserToken.token, quizOneId.quizId, autoStart).sessionId;
      const sessionIdTwo = requestQuizSessionStart(ownsQuizUserToken.token, quizOneId.quizId, autoStart).sessionId;
      requestSessionStateUpdate(ownsQuizUserToken.token, quizOneId.quizId, sessionIdOne, sessionState.END);
      requestSessionStateUpdate(ownsQuizUserToken.token, quizOneId.quizId, sessionIdTwo, sessionState.END);
      expect(() => requestQuizRemoveV2(ownsQuizUserToken.token, quizOneId.quizId).toThrow(HTTPError[400]));
    })
  });
});
