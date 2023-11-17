import { requestAuthRegister, requestClear, requestQuizCreate, requestTrashViewV2, requestQuizRemove } from './wrapper';
import { validDetails, TokenReturn, QuizIdReturn } from '../types';

import HTTPError from 'http-errors';

afterEach(() => {
  requestClear();
});

describe('tests for view Trash', () => {
  let token: TokenReturn;
  let quizId: QuizIdReturn;

  beforeEach(() => {
    requestClear();
    token = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    quizId = requestQuizCreate(token.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
  });

  // Error cases
  test('Invalid token', () => {
    expect(() => requestTrashViewV2(token.token + 'a')).toThrow(HTTPError[401]);
  });

  // Success cases
  test('Doesnt own a trashed Quiz', () => {
    const res = requestTrashViewV2(token.token);
    expect(res).toStrictEqual({ quizzes: [] });
  });

  test('Owns a trashed Quiz', () => {
    requestQuizRemove(token.token, quizId.quizId);
    const res = requestTrashViewV2(token.token);

    const expectedResult = {
      quizzes: [{
        quizId: quizId.quizId,
        name: validDetails.QUIZ_NAME,
      }]
    };

    expect(res).toStrictEqual(expectedResult);
  });
});
