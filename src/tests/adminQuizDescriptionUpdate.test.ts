import { Quiz } from '../dataStore';
import { QuizIdReturn, TokenReturn, validDetails } from '../types';
import { requestAuthRegister, requestClear, requestQuizCreate, requestQuizDescriptionUpdate, requestQuizInfo } from './wrapper';

import HTTPError from 'http-errors';

// Tests for adminQuizDescriptionUpdate
describe('PUT /v1/admin/quiz/{quizid}/description', () => {
  let ownsQuizUser: TokenReturn;
  let quizId: QuizIdReturn;
  beforeEach(() => {
    requestClear();
    ownsQuizUser = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    quizId = requestQuizCreate(ownsQuizUser.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
  });

  describe('Invalid Input Tests', () => {
    test('Token is empty', () => {
      expect(() => requestQuizDescriptionUpdate('', quizId.quizId, '')).toThrow(HTTPError[401]);
    });

    test('Token is invalid', () => {
      expect(() => requestQuizDescriptionUpdate(ownsQuizUser.token + 1, quizId.quizId, '')).toThrow(HTTPError[401]);
    });

    test('Invalid Description', () => {
      const longDescription = 'a'.repeat(105);
      expect(() => requestQuizDescriptionUpdate(ownsQuizUser.token, quizId.quizId, longDescription)).toThrow(HTTPError[400]);
    });

    test('quizId user doesnt own', () => {
      const noQuizUserToken = requestAuthRegister(validDetails.EMAIL_2, validDetails.PASSWORD_2, validDetails.FIRST_NAME_2, validDetails.LAST_NAME_2);
      expect(() => requestQuizDescriptionUpdate(noQuizUserToken.token, quizId.quizId, '')).toThrow(HTTPError[403]);
    });
  });

  describe('Valid Input test', () => {
    let quizInfo: Quiz;
    test('All inputs are valid', () => {
      const initialTime = requestQuizInfo(ownsQuizUser.token, quizId.quizId).timeLastEdited;
      expect(requestQuizDescriptionUpdate(ownsQuizUser.token, quizId.quizId, 'newDescription')).toStrictEqual({});
      quizInfo = requestQuizInfo(ownsQuizUser.token, quizId.quizId);
      expect(quizInfo.description).toStrictEqual('newDescription');
      expect(quizInfo.timeLastEdited).toBeGreaterThanOrEqual(initialTime);
      expect(quizInfo.timeLastEdited).toBeLessThanOrEqual(initialTime + 1);
    });

    test('All inputs are valid but description is empty string', () => {
      const initialTime = requestQuizInfo(ownsQuizUser.token, quizId.quizId).timeLastEdited;
      expect(requestQuizDescriptionUpdate(ownsQuizUser.token, quizId.quizId, '')).toStrictEqual({});
      quizInfo = requestQuizInfo(ownsQuizUser.token, quizId.quizId);
      expect(quizInfo.description).toStrictEqual('');
      expect(quizInfo.timeLastEdited).toBeGreaterThanOrEqual(initialTime);
      expect(quizInfo.timeLastEdited).toBeLessThanOrEqual(initialTime + 1);
    });
  });
});
