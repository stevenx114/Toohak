import { Quiz } from '../dataStore';
import { QuizIdReturn, TokenReturn, validDetails } from '../types';
import { requestAuthRegister, requestClear, requestQuizCreate, requestQuizDescriptionUpdateV2, requestQuizInfo } from './wrapper';

import HTTPError from 'http-errors';

afterEach(() => {
  requestClear();
});

// Tests for adminQuizDescriptionUpdate v2
describe('PUT /v2/admin/quiz/{quizid}/description', () => {
  let ownsQuizUser: TokenReturn;
  let quizId: QuizIdReturn;
  beforeEach(() => {
    requestClear();
    ownsQuizUser = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    quizId = requestQuizCreate(ownsQuizUser.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
  });

  describe('Invalid Input Tests', () => {
    test('Token is empty', () => {
      expect(() => requestQuizDescriptionUpdateV2('', quizId.quizId, '')).toThrow(HTTPError[401]);
    });

    test('Token is invalid', () => {
      expect(() => requestQuizDescriptionUpdateV2(ownsQuizUser.token + 1, quizId.quizId, '')).toThrow(HTTPError[401]);
    });

    test('Invalid Description', () => {
      const longDescription = 'a'.repeat(105);
      expect(() => requestQuizDescriptionUpdateV2(ownsQuizUser.token, quizId.quizId, longDescription)).toThrow(HTTPError[400]);
    });

    test('quizId user doesnt own', () => {
      const noQuizUserToken = requestAuthRegister(validDetails.EMAIL_2, validDetails.PASSWORD_2, validDetails.FIRST_NAME_2, validDetails.LAST_NAME_2);
      expect(() => requestQuizDescriptionUpdateV2(noQuizUserToken.token, quizId.quizId, '')).toThrow(HTTPError[403]);
    });
  });

  describe('Valid Input test', () => {
    let quizInfo: Quiz;
    test('All inputs are valid', () => {
      const initialTime = requestQuizInfo(ownsQuizUser.token, quizId.quizId).timeLastEdited;
      expect(requestQuizDescriptionUpdateV2(ownsQuizUser.token, quizId.quizId, 'newDescription')).toStrictEqual({});
      quizInfo = requestQuizInfo(ownsQuizUser.token, quizId.quizId);
      expect(quizInfo.description).toStrictEqual('newDescription');
      expect(quizInfo.timeLastEdited).toBeGreaterThanOrEqual(initialTime);
      expect(quizInfo.timeLastEdited).toBeLessThanOrEqual(initialTime + 1);
    });

    test('All inputs are valid but description is empty string', () => {
      const initialTime = requestQuizInfo(ownsQuizUser.token, quizId.quizId).timeLastEdited;
      expect(requestQuizDescriptionUpdateV2(ownsQuizUser.token, quizId.quizId, '')).toStrictEqual({});
      quizInfo = requestQuizInfo(ownsQuizUser.token, quizId.quizId);
      expect(quizInfo.description).toStrictEqual('');
      expect(quizInfo.timeLastEdited).toBeGreaterThanOrEqual(initialTime);
      expect(quizInfo.timeLastEdited).toBeLessThanOrEqual(initialTime + 1);
    });
  });
});
