import {
  requestAuthRegister,
  requestClear,
  requestQuizCreate,
  requestTrashView,
  requestQuizRemove,
  requestEmptyTrash
} from './wrapper';

import {
  validDetails,
  TokenReturn,
  QuizIdReturn,
} from '../types';

import HTTPError from 'http-errors';

afterEach(() => {
  requestClear();
});

describe('Tests for adminQuizEmptyTrash', () => {
  let token: TokenReturn;
  let quiz: QuizIdReturn;
  let arrayOfIds: string;

  beforeEach(() => {
    requestClear();
    token = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    quiz = requestQuizCreate(token.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
  });

  test('Success Case', () => {
    requestQuizRemove(token.token, quiz.quizId);
    expect(requestTrashView(token.token)).toStrictEqual({
      quizzes: [{
        quizId: quiz.quizId,
        name: validDetails.QUIZ_NAME,
      }]
    });
    arrayOfIds = ('[' + quiz.quizId + ']').toString();
    requestEmptyTrash(token.token, arrayOfIds);
    expect(requestTrashView(token.token)).toStrictEqual({
      quizzes: []
    });
  });

  describe('Error cases for adminQuizEmptyTrash', () => {
    test('Trying to empty quizzes not in trash', () => {
      arrayOfIds = '[' + quiz.quizId.toString() + ']';
      expect(() => requestEmptyTrash(token.token, arrayOfIds)).toThrow(HTTPError[400]);
    });
    test('Testing for invalid token', () => {
      arrayOfIds = '[' + quiz.quizId.toString() + ']';
      expect(() => requestEmptyTrash(token.token + 1, arrayOfIds)).toThrow(HTTPError[401]);
    });
    test('Quiz ID refers to a quiz that current user does not own', () => {
      const noQuizzes = requestAuthRegister(validDetails.EMAIL_2, validDetails.PASSWORD_2, validDetails.FIRST_NAME_2, validDetails.LAST_NAME_2);
      requestQuizRemove(token.token, quiz.quizId);
      arrayOfIds = '[' + quiz.quizId.toString() + ']';
      expect(() => requestEmptyTrash(noQuizzes.token, arrayOfIds)).toThrow(HTTPError[403]);
    });
  });
});
