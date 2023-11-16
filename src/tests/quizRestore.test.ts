import { QuizIdReturn, TokenReturn, validDetails } from '../types';
import { requestAuthRegister, requestClear, requestQuizCreate, requestQuizRemove, requestQuizRestore } from './wrapper';

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
    quizId = requestQuizCreate(token.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
    requestQuizRemove(token.token, quizId.quizId);
  });

  describe('Valid Input test', () => {
    test('All inputs are valid', () => {
      const res = requestQuizRestore(quizId.quizId, token.token);
      expect(res).toStrictEqual({});
    });
  });

  describe('Invalid Input Tests', () => {
    test('Quiz name of the restored quiz is already used by another active quiz', () => {
      requestQuizCreate(token.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
      expect(() => requestQuizRestore(quizId.quizId, token.token)).toThrow(HTTPError[400]);
    });

    test('Quiz ID refers to a quiz that is not currently in the trash', () => {
      quizId = requestQuizCreate(token.token, 'a' + validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
      expect(() => requestQuizRestore(quizId.quizId, token.token)).toThrow(HTTPError[400]);
    });

    test('Valid token is provided, but user is not an owner of this quiz', () => {
      const token2 = requestAuthRegister('a' + validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
      expect(() => requestQuizRestore(quizId.quizId, token2.token)).toThrow(HTTPError[403]);
    });

    test('Token is empty', () => {
      expect(() => requestQuizRestore(quizId.quizId, '123')).toThrow(HTTPError[401]);
    });

    test('Token is invalid and does not refer to a valid loggin in user', () => {
      expect(() => requestQuizRestore(quizId.quizId, '231')).toThrow(HTTPError[401]);
    });
  });
});
