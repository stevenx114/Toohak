import {
  validDetails,
  TokenReturn,
} from '../types';

import {
  requestAuthRegister,
  requestQuizCreate,
  requestClear,
} from './wrapper';

import HTTPError from 'http-errors';

beforeEach(() => {
  requestClear();
});

// Tests for AdminQuizCreate function
describe('POST v1/admin/quiz', () => {
  let userToken: TokenReturn;
  beforeEach(() => {
    userToken = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    requestQuizCreate(userToken.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
  });

  // Error cases for AdminQuizCreate function
  test('Token is empty', () => {
    expect(() => requestQuizCreate('', validDetails.QUIZ_NAME, validDetails.DESCRIPTION).toThrow(HTTPError[400]));
  });

  test('Token is invalid', () => {
    expect(() => requestQuizCreate(userToken.token + 1, validDetails.QUIZ_NAME, validDetails.DESCRIPTION).toThrow(HTTPError[400]));
  });

  test.each([
    { name: '' }, // empty
    { name: '!23' }, // invalid char
    { name: '!*^&' }, // invalid char
    { name: 'qw' }, // < 2 chars
    { name: '12' }, // < 2 chars
    { name: 'qwerty'.repeat(6) }, // > 30 chars
  ])('invalid name input: $name', ({ name }) => {
    expect(() => requestQuizCreate(userToken.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION).toThrow(HTTPError[400]));
  });

  test('description too long', () => {
    const longDescription = 'description'.repeat(10);
    expect(() => requestQuizCreate(userToken.token, validDetails.QUIZ_NAME, longDescription).toThrow(HTTPError[400]));
  });

  test('existing quiz name', () => {
    expect(() => requestQuizCreate(userToken.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION).toThrow(HTTPError[400]));
  });

  // Success case for adminQuizCreate function
  test('Valid input', () => {
    expect(requestQuizCreate(userToken.token, 'nameValid', validDetails.DESCRIPTION)).toStrictEqual({
      quizId: expect.any(Number),
    });
  });

  test('Valid input, description empty', () => {
    expect(requestQuizCreate(userToken.token, 'nameValid', '')).toStrictEqual({
      quizId: expect.any(Number),
    });
  });
});
