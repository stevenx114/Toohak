import { QuizIdReturn, TokenReturn, validDetails } from '../types';
import { requestAuthRegister, requestClear, requestQuizCreateV2, requestQuizRemoveV2, requestQuizRestoreV2 } from './wrapper';

import HTTPError from 'http-errors';

afterEach(() => {
  requestClear();
});

describe('quizRestore test', () => {
  let token: TokenReturn;
  let quizId: QuizIdReturn;

  beforeEach(() => {
    requestClear();
    token = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    quizId = requestQuizCreateV2(token.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
    requestQuizRemoveV2(token.token, quizId.quizId);
  });

  describe('Valid Input test', () => {
    test('All inputs are valid', () => {
      const res = requestQuizRestoreV2(quizId.quizId, token.token);
      expect(res).toStrictEqual({});
    });
  });

  describe('Invalid Input Tests', () => {
    test('Quiz name of the restored quiz is already used by another active quiz', () => {
      requestQuizCreateV2(token.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
      expect(() => requestQuizRestoreV2(quizId.quizId, token.token)).toThrow(HTTPError[400]);
    });

    test('Quiz ID refers to a quiz that is not currently in the trash', () => {
      quizId = requestQuizCreateV2(token.token, 'a' + validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
      expect(() => requestQuizRestoreV2(quizId.quizId, token.token)).toThrow(HTTPError[400]);
    });

    test('Valid token is provided, but user is not an owner of this quiz', () => {
      const token2 = requestAuthRegister('a' + validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
      expect(() => requestQuizRestoreV2(quizId.quizId, token2.token)).toThrow(HTTPError[403]);
    });

    test('Token is empty', () => {
      expect(() => requestQuizRestoreV2(quizId.quizId, '123')).toThrow(HTTPError[401]);
    });

    test('Token is invalid and does not refer to a valid loggin in user', () => {
      expect(() => requestQuizRestoreV2(quizId.quizId, '231')).toThrow(HTTPError[401]);
    });
  });
});
