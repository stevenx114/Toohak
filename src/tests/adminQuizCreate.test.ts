import {
  validDetails,
  TokenReturn,
  ErrorObject
} from '../types';

import {
  requestAuthRegister,
  requestQuizCreate,
  requestClear,
} from './wrapper';

const ERROR = expect.any(String);

beforeEach(() => {
  requestClear();
});

// Tests for AdminQuizCreate function
describe('POST v1/admin/quiz', () => {
  let userToken: TokenReturn;
  let errorResult: ErrorObject;
  beforeEach(() => {
    userToken = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    requestQuizCreate(userToken.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
  });

  // Error cases for AdminQuizCreate function
  test('Token is empty', () => {
    errorResult = requestQuizCreate('', validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
    expect(errorResult.error).toStrictEqual(ERROR);
    expect(errorResult.statusCode).toStrictEqual(401);
  });

  test('Token is invalid', () => {
    errorResult = requestQuizCreate(userToken.token + 1, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
    expect(errorResult.error).toStrictEqual(ERROR);
    expect(errorResult.statusCode).toStrictEqual(401);
  });

  test.each([
    { name: '' }, // empty
    { name: '!23' }, // invalid char
    { name: '!*^&' }, // invalid char
    { name: 'qw' }, // < 2 chars
    { name: '12' }, // < 2 chars
    { name: 'qwerty'.repeat(6) }, // > 30 chars
  ])('invalid name input: $name', ({ name }) => {
    errorResult = requestQuizCreate(userToken.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
    expect(errorResult.error).toStrictEqual(ERROR);
    expect(errorResult.statusCode).toStrictEqual(400);
  });

  test('description too long', () => {
    const longDescription = 'description'.repeat(10);
    errorResult = requestQuizCreate(userToken.token, validDetails.QUIZ_NAME, longDescription);
    expect(errorResult.error).toStrictEqual(ERROR);
    expect(errorResult.statusCode).toStrictEqual(400);
  });

  test('existing quiz name', () => {
    errorResult = requestQuizCreate(userToken.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
    expect(errorResult.error).toStrictEqual(ERROR);
    expect(errorResult.statusCode).toStrictEqual(400);
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

// Tests for AdminQuizCreate function
describe('POST v1/admin/quiz', () => {
  let userToken: TokenReturn;
  let errorResult: ErrorObject;
  beforeEach(() => {
    userToken = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    requestQuizCreate(userToken.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
  });

  // Error cases for AdminQuizCreate function
  test('Token is empty', () => {
    errorResult = requestQuizCreate('', validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
    expect(errorResult.error).toStrictEqual(ERROR);
    expect(errorResult.statusCode).toStrictEqual(401);
  });

  test('Token is invalid', () => {
    errorResult = requestQuizCreate(userToken.token + 1, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
    expect(errorResult.error).toStrictEqual(ERROR);
    expect(errorResult.statusCode).toStrictEqual(401);
  });

  test.each([
    { name: '' }, // empty
    { name: '!23' }, // invalid char
    { name: '!*^&' }, // invalid char
    { name: 'qw' }, // < 2 chars
    { name: '12' }, // < 2 chars
    { name: 'qwerty'.repeat(6) }, // > 30 chars
  ])('invalid name input: $name', ({ name }) => {
    errorResult = requestQuizCreate(userToken.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
    expect(errorResult.error).toStrictEqual(ERROR);
    expect(errorResult.statusCode).toStrictEqual(400);
  });

  test('description too long', () => {
    const longDescription = 'description'.repeat(10);
    errorResult = requestQuizCreate(userToken.token, validDetails.QUIZ_NAME, longDescription);
    expect(errorResult.error).toStrictEqual(ERROR);
    expect(errorResult.statusCode).toStrictEqual(400);
  });

  test('existing quiz name', () => {
    errorResult = requestQuizCreate(userToken.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
    expect(errorResult.error).toStrictEqual(ERROR);
    expect(errorResult.statusCode).toStrictEqual(400);
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
