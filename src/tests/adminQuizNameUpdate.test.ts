import {
  validDetails,
  QuizIdReturn,
  TokenReturn
} from '../types';

import {
  requestAuthRegister,
  requestQuizCreate,
  requestQuizInfo,
  requestClear,
  requestQuizNameUpdate
} from './wrapper';

import HTTPError from 'http-errors';

beforeEach(() => {
  requestClear();
});

afterEach(() => {
  requestClear();
});

// Tests for adminQuizNameUpdate function
describe('PUT /v1/admin/quiz/{quizid}/name', () => {
  let newUser: TokenReturn;
  let newQuiz: QuizIdReturn;
  beforeEach(() => {
    newUser = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    newQuiz = requestQuizCreate(newUser.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
  });

  // Success cases for adminQuizNameUpdate function
  describe('Success Cases', () => {
    test('Successful implementation', () => {
      const initialTime = requestQuizInfo(newUser.token, newQuiz.quizId).timeLastEdited;
      expect(requestQuizNameUpdate(newUser.token, newQuiz.quizId, 'name Updated')).toEqual({});
      const curQuiz = requestQuizInfo(newUser.token, newQuiz.quizId);
      expect(curQuiz.name).toEqual('name Updated');
      expect(curQuiz.timeLastEdited).toBeGreaterThanOrEqual(initialTime);
      expect(curQuiz.timeLastEdited).toBeLessThanOrEqual(initialTime + 1);
    });
  });

  // Error cases for adminQuizNameUpdate function
  describe('Error cases', () => {
    test('Token is empty', () => {
      expect(() => requestQuizNameUpdate('', newQuiz.quizId, 'name Updated')).toThrow(HTTPError[401]);
    });

    test('Token is invalid', () => {
      expect(() => requestQuizNameUpdate(newUser.token + 1, newQuiz.quizId, 'name Updated')).toThrow(HTTPError[401]);
    });

    test('Quiz ID does not refer to a quiz that this user owns', () => {
      const noQuizzesUser = requestAuthRegister('noquizzesuser@gmail.com', validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
      expect(() => requestQuizNameUpdate(noQuizzesUser.token, newQuiz.quizId, 'name Updated')).toThrow(HTTPError[403]);
    });

    test('Name contains invalid characters. Valid characters are alphanumeric and spaces', () => {
      expect(() => requestQuizNameUpdate(newUser.token, newQuiz.quizId, 'name Updated!')).toThrow(HTTPError[400]);
    });

    test('Name is less than 3 characters long', () => {
      expect(() => requestQuizNameUpdate(newUser.token, newQuiz.quizId, 'na')).toThrow(HTTPError[400]);
    });

    test('Name is more than 30 characters long', () => {
      expect(() => requestQuizNameUpdate(newUser.token, newQuiz.quizId, 'nameUpdatednameUpdatednameUpdated')).toThrow(HTTPError[400]);
    });

    test('Name is already used by the current logged in user for another quiz', () => {
      requestQuizCreate(newUser.token, 'nameOther', validDetails.DESCRIPTION);
      expect(() => requestQuizNameUpdate(newUser.token, newQuiz.quizId, 'nameOther')).toThrow(HTTPError[400]);
    });
  });
});
