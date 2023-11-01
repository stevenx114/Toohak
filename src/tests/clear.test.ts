import {
  validDetails,
  TokenReturn,
} from '../types';

import {
  requestClear,
  requestUserDetails,
  requestAuthRegister,
  requestQuizCreate,
  requestQuizList
} from './wrapper';

const ERROR = expect.any(String);

describe('Clear Function implementation', () => {
  let token: TokenReturn;

  beforeEach(() => {
    token = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    requestQuizCreate(token.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
  });

  test('Returns empty dictionary', () => {
    expect(requestClear()).toStrictEqual({});
  });

  test('Removing user data', () => {
    expect(requestClear()).toStrictEqual({});
    const res = requestUserDetails(token.token);
    expect(res.error).toStrictEqual(ERROR);
    expect(res.statusCode).toStrictEqual(401);
  });

  test('Removing quiz data', () => {
    expect(requestClear()).toStrictEqual({});
    token = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    expect(requestQuizList(token.token)).toStrictEqual({ quizzes: [] });
  });
});
