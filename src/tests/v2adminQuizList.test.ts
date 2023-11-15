import {
  validDetails,
  QuizIdReturn,
  TokenReturn,
} from '../types';

import {
  requestAuthRegister,
  requestClear,
  requestQuizCreateV2,
  requestQuizListV2,
  requestLogoutV2
} from './wrapper';

import HTTPError from 'http-errors';

beforeEach(() => {
  requestClear();
});

// Tests for adminQuizListV2
describe('GET /v2/admin/quiz/list', () => {
  let user: TokenReturn;
  let quiz: QuizIdReturn;
  let quiz1: QuizIdReturn;
  beforeEach(() => {
    requestClear();
    user = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    quiz = requestQuizCreateV2(user.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
  });

  // Error cases
  test('Token is empty', () => {
    expect(() => requestQuizListV2('')).toThrow(HTTPError[401]);
  });

  test('Token is invalid', () => {
    expect(() => requestQuizListV2(user.token + 1)).toThrow(HTTPError[401]);
  });

  test('Token does not refer to valid logged in user session', () => {
    requestLogoutV2(user.token);
    expect(() => requestQuizListV2(user.token)).toThrow(HTTPError[401]);
  });

  // success cases:
  test('valid input of 1 quiz', () => {
    expect(requestQuizListV2(user.token)).toStrictEqual({
      quizzes: [
        {
          quizId: quiz.quizId,
          name: validDetails.QUIZ_NAME,
        }
      ]
    });
  });

  test('valid input of 2 quizzes', () => {
    quiz1 = requestQuizCreateV2(user.token, validDetails.QUIZ_NAME_2, validDetails.DESCRIPTION);
    expect(requestQuizListV2(user.token)).toStrictEqual({
      quizzes: [
        {
          quizId: quiz.quizId,
          name: validDetails.QUIZ_NAME,
        },
        {
          quizId: quiz1.quizId,
          name: validDetails.QUIZ_NAME_2,
        },
      ]
    });
  });
});
