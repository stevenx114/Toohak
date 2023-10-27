import { Quiz } from '../dataStore';
import { ErrorObject, QuizIdReturn, TokenReturn, validDetails } from '../types';
import { requestAuthRegister, requestClear, requestQuizCreate, requestQuizDescriptionUpdate, requestQuizInfo } from './wrapper';

const ERROR = expect.any(String);

// Tests for adminQuizDescriptionUpdate
describe('PUT /v1/admin/quiz/{quizid}/description', () => {
  let ownsQuizUser: TokenReturn;
  let quizId: QuizIdReturn;
  let errorResult: ErrorObject;
  beforeEach(() => {
    requestClear();
    ownsQuizUser = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    quizId = requestQuizCreate(ownsQuizUser.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
  });

  describe('Invalid Input Tests', () => {
    test('Token is empty', () => {
      errorResult = requestQuizDescriptionUpdate('', quizId.quizId, '');
      expect(errorResult.error).toStrictEqual(ERROR);
      expect(errorResult.statusCode).toStrictEqual(401);
    });

    test('Token is invalid', () => {
      errorResult = requestQuizDescriptionUpdate(ownsQuizUser.token + 1, quizId.quizId, '');
      expect(errorResult.error).toStrictEqual(ERROR);
      expect(errorResult.statusCode).toStrictEqual(401);
    });

    test('Invalid Description', () => {
      const longDescription = 'a'.repeat(105);
      errorResult = requestQuizDescriptionUpdate(ownsQuizUser.token, quizId.quizId, longDescription);
      expect(errorResult.error).toStrictEqual(ERROR);
      expect(errorResult.statusCode).toStrictEqual(400);
    });

    test('quizId user doesnt own', () => {
      const noQuizUserToken = requestAuthRegister(validDetails.EMAIL_2, validDetails.PASSWORD_2, validDetails.FIRST_NAME_2, validDetails.LAST_NAME_2);
      errorResult = requestQuizDescriptionUpdate(noQuizUserToken.token, quizId.quizId, '');
      expect(errorResult.error).toStrictEqual(ERROR);
      expect(errorResult.statusCode).toStrictEqual(403);
    });
  });

  describe('Valid Input test', () => {
    let quizInfo: Quiz;
    test('All inputs are valid', () => {
      expect(requestQuizDescriptionUpdate(ownsQuizUser.token, quizId.quizId, 'newDescription')).toStrictEqual({});
      quizInfo = requestQuizInfo(ownsQuizUser.token, quizId.quizId);
      expect(quizInfo.description).toStrictEqual('newDescription');
    });

    test('All inputs are valid but description is empty string', () => {
      expect(requestQuizDescriptionUpdate(ownsQuizUser.token, quizId.quizId, '')).toStrictEqual({});
      quizInfo = requestQuizInfo(ownsQuizUser.token, quizId.quizId);
      expect(quizInfo.description).toStrictEqual('');
    });
  });
});
