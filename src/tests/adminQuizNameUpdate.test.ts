import {
  validDetails,
  QuizIdReturn,
  TokenReturn,
  ErrorObject
} from '../types';

import {
  requestAuthRegister,
  requestQuizCreate,
  requestQuizInfo,
  requestClear,
  requestQuizNameUpdate
} from './wrapper';

const ERROR = expect.any(String);

beforeEach(() => {
  requestClear();
});

// Tests for adminQuizNameUpdate function
describe('PUT /v1/admin/quiz/{quizid}/description', () => {
  let newUser: TokenReturn;
  let newQuiz: QuizIdReturn;
  let errorResult: ErrorObject;
  beforeEach(() => {
    newUser = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    newQuiz = requestQuizCreate(newUser.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
  });

  // Success cases for adminQuizNameUpdate function
  describe('Success Cases', () => {
    test('Successful implementation', () => {
      expect(requestQuizNameUpdate(newUser.token, newQuiz.quizId, 'name Updated')).toEqual({});
      const curQuiz = requestQuizInfo(newUser.token, newQuiz.quizId);
      expect(curQuiz.name).toEqual('name Updated');
    });
  });

  // Error cases for adminQuizNameUpdate function
  describe('Error cases', () => {
    test('Token is empty', () => {
      errorResult = requestQuizNameUpdate('', newQuiz.quizId, 'name Updated');
      expect(errorResult.error).toEqual(ERROR);
      expect(errorResult.statusCode).toEqual(401);
    });

    test('Token is invalid', () => {
      errorResult = requestQuizNameUpdate(newUser.token + 1, newQuiz.quizId, 'name Updated');
      expect(errorResult.error).toEqual(ERROR);
      expect(errorResult.statusCode).toEqual(401);
    });

    test('Quiz ID does not refer to a quiz that this user owns', () => {
      const noQuizzesUser = requestAuthRegister('noquizzesuser@gmail.com', validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
      errorResult = requestQuizNameUpdate(noQuizzesUser.token, newQuiz.quizId, 'name Updated');
      expect(errorResult.error).toEqual(ERROR);
      expect(errorResult.statusCode).toEqual(403);
    });

    test('Name contains invalid characters. Valid characters are alphanumeric and spaces', () => {
      errorResult = requestQuizNameUpdate(newUser.token, newQuiz.quizId, 'name Updated!');
      expect(errorResult.error).toEqual(ERROR);
      expect(errorResult.statusCode).toEqual(400);
    });

    test('Name is less than 3 characters long', () => {
      errorResult = requestQuizNameUpdate(newUser.token, newQuiz.quizId, 'na');
      expect(errorResult.error).toEqual(ERROR);
      expect(errorResult.statusCode).toEqual(400);
    });

    test('Name is more than 30 characters long', () => {
      errorResult = requestQuizNameUpdate(newUser.token, newQuiz.quizId, 'nameUpdatednameUpdatednameUpdated');
      expect(errorResult.error).toEqual(ERROR);
      expect(errorResult.statusCode).toEqual(400);
    });

    test('Name is already used by the current logged in user for another quiz', () => {
      requestQuizCreate(newUser.token, 'nameOther', validDetails.DESCRIPTION);
      errorResult = requestQuizNameUpdate(newUser.token, newQuiz.quizId, 'nameOther');
      expect(errorResult.error).toEqual(ERROR);
      expect(errorResult.statusCode).toEqual(400);
    });
  });
});
