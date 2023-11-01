import {
  validDetails,
  QuizIdReturn,
  TokenReturn,
  ErrorObject,

} from '../types';

import {
  requestAuthRegister,
  requestQuizCreate,
  requestClear,
  requestQuizRemove,
  requestQuizList,
} from './wrapper';

const ERROR = expect.any(String);

// Tests for adminQuizRemove function
describe('DELETE /v1/admin/quiz/{quizid}', () => {
  let ownsQuizUserToken: TokenReturn;
  let noQuizUserToken: TokenReturn;
  let quizOneId: QuizIdReturn;
  let quizTwoId: QuizIdReturn;
  let errorResult: ErrorObject;
  beforeEach(() => {
    requestClear();
    ownsQuizUserToken = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    noQuizUserToken = requestAuthRegister(validDetails.EMAIL_2, validDetails.PASSWORD_2, validDetails.FIRST_NAME_2, validDetails.LAST_NAME_2);
    quizOneId = requestQuizCreate(ownsQuizUserToken.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
    quizTwoId = requestQuizCreate(ownsQuizUserToken.token, validDetails.QUIZ_NAME_2, validDetails.DESCRIPTION_2);
  });
  describe('Success cases', () => {
    test('Successful removal of quiz one', () => {
      requestQuizRemove(ownsQuizUserToken.token, quizOneId.quizId);
      expect(requestQuizList(ownsQuizUserToken.token)).toStrictEqual({
        quizzes: [
          {
            quizId: quizTwoId.quizId,
            name: validDetails.QUIZ_NAME_2
          }
        ]
      });
    });
    test('Successful removal of quiz two', () => {
      expect(requestQuizRemove(ownsQuizUserToken.token, quizTwoId.quizId)).toEqual({});
      expect(requestQuizList(ownsQuizUserToken.token)).toStrictEqual({
        quizzes: [
          {
            quizId: quizOneId.quizId,
            name: validDetails.QUIZ_NAME
          }
        ]
      });
    });
  });
  describe('Error Cases', () => {
    test('Token is empty', () => {
      errorResult = requestQuizRemove('', quizOneId.quizId);
      expect(errorResult.error).toStrictEqual(ERROR);
      expect(errorResult.statusCode).toStrictEqual(401);
    });

    test('Token is invalid', () => {
      errorResult = requestQuizRemove(ownsQuizUserToken.token + '1', quizOneId.quizId);
      expect(errorResult.error).toStrictEqual(ERROR);
      expect(errorResult.statusCode).toStrictEqual(401);
    });
    test('Quiz Id does not refer to a quiz that this user owns', () => {
      errorResult = requestQuizRemove(noQuizUserToken.token, quizOneId.quizId);
      expect(errorResult.error).toStrictEqual(ERROR);
      expect(errorResult.statusCode).toStrictEqual(403);
    });
  });
});
