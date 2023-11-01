import {
  validDetails,
  QuizIdReturn,
  TokenReturn,
  ErrorObject
} from '../types';

import {
  requestAuthRegister,
  requestQuizCreate,
  requestClear,
  requestQuizList,
  requestLogout
} from './wrapper';

const ERROR = expect.any(String);

beforeEach(() => {
  requestClear();
});

// Tests for adminQuizList
describe('GET /v1/admin/quiz/list', () => {
  let user: TokenReturn;
  let quiz: QuizIdReturn;
  let quiz1: QuizIdReturn;
  let errorResult: ErrorObject;
  beforeEach(() => {
    user = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    quiz = requestQuizCreate(user.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
  });

  // Error cases
  test('Token is empty', () => {
    errorResult = requestQuizList('');
    expect(errorResult.error).toEqual(ERROR);
    expect(errorResult.statusCode).toEqual(401);
  });

  test('Token is invalid', () => {
    errorResult = requestQuizList(user.token + 1);
    expect(errorResult.error).toEqual(ERROR);
    expect(errorResult.statusCode).toEqual(401);
  });

  test('Token does not refer to valid logged in user session', () => {
    requestLogout(user.token);
    errorResult = requestQuizList(user.token);
    expect(errorResult.error).toEqual(ERROR);
    expect(errorResult.statusCode).toEqual(401);
  });

  // success cases:
  test('valid input of 1 quiz', () => {
    expect(requestQuizList(user.token)).toStrictEqual({
      quizzes: [
        {
          quizId: quiz.quizId,
          name: validDetails.QUIZ_NAME,
        }
      ]
    });
  });

  test('valid input of 2 quizzes', () => {
    quiz1 = requestQuizCreate(user.token, validDetails.QUIZ_NAME_2, validDetails.DESCRIPTION);
    expect(requestQuizList(user.token)).toStrictEqual({
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
