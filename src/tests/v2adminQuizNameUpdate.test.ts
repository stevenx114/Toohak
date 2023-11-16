import {
  validDetails,
  QuizIdReturn,
  TokenReturn
} from '../types';

import {
  requestAuthRegister,
  requestQuizCreateV2,
  requestQuizInfo,
  requestClear,
  requestQuizNameUpdateV2
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
    newQuiz = requestQuizCreateV2(newUser.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
  });

  // Success cases for adminQuizNameUpdate function
  describe('Success Cases', () => {
    test('Successful implementation', () => {
      const initialTime = requestQuizInfo(newUser.token, newQuiz.quizId).timeLastEdited;
      expect(requestQuizNameUpdateV2(newUser.token, newQuiz.quizId, 'name Updated')).toEqual({});
      const curQuiz = requestQuizInfo(newUser.token, newQuiz.quizId);
      expect(curQuiz.name).toEqual('name Updated');
      expect(curQuiz.timeLastEdited).toBeGreaterThanOrEqual(initialTime);
      expect(curQuiz.timeLastEdited).toBeLessThanOrEqual(initialTime + 1);
    });
  });

  // Error cases for adminQuizNameUpdate function
  describe('Error cases', () => {
    test('Token is empty', () => {
      expect(() => requestQuizNameUpdateV2('', newQuiz.quizId, 'name Updated')).toThrow(HTTPError[401]);
    });

    test('Token is invalid', () => {
      expect(() => requestQuizNameUpdateV2(newUser.token + 1, newQuiz.quizId, 'name Updated')).toThrow(HTTPError[401]);
    });

    test('Quiz ID does not refer to a quiz that this user owns', () => {
      const noQuizzesUser = requestAuthRegister('noquizzesuser@gmail.com', validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
      expect(() => requestQuizNameUpdateV2(noQuizzesUser.token, newQuiz.quizId, 'name Updated')).toThrow(HTTPError[403]);
    });

    test('Name contains invalid characters. Valid characters are alphanumeric and spaces', () => {
      expect(() => requestQuizNameUpdateV2(newUser.token, newQuiz.quizId, 'name Updated!')).toThrow(HTTPError[400]);
    });

    test('Name is less than 3 characters long', () => {
      expect(() => requestQuizNameUpdateV2(newUser.token, newQuiz.quizId, 'na')).toThrow(HTTPError[400]);
    });

    test('Name is more than 30 characters long', () => {
      expect(() => requestQuizNameUpdateV2(newUser.token, newQuiz.quizId, 'nameUpdatednameUpdatednameUpdated')).toThrow(HTTPError[400]);
    });

    test('Name is already used by the current logged in user for another quiz', () => {
      requestQuizCreateV2(newUser.token, 'nameOther', validDetails.DESCRIPTION);
      expect(() => requestQuizNameUpdateV2(newUser.token, newQuiz.quizId, 'nameOther')).toThrow(HTTPError[400]);
    });
  });
});
