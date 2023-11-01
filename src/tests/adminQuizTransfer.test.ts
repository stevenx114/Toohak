import {
  validDetails,
  TokenReturn,
  ErrorObject,
  QuizIdReturn,
} from '../types';

import {
  requestAuthRegister,
  requestQuizCreate,
  requestClear,
  requestQuizTransfer,
  requestQuizList
} from './wrapper';

const ERROR = expect.any(String);

beforeEach(() => {
  requestClear();
});

// Tests for adminQuizTransfer function
describe('POST v1/admin/quiz/:quizid/transfer', () => {
  let userOne: TokenReturn;
  let userTwo: TokenReturn;
  let quiz1: QuizIdReturn;
  let quiz2: QuizIdReturn;
  let quiz3: QuizIdReturn;
  let quiz4: QuizIdReturn;
  let errorResult: ErrorObject;

  beforeEach(() => {
    userOne = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    userTwo = requestAuthRegister(validDetails.EMAIL_2, validDetails.PASSWORD_2, validDetails.FIRST_NAME_2, validDetails.LAST_NAME_2);
    quiz1 = requestQuizCreate(userOne.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
    quiz2 = requestQuizCreate(userTwo.token, validDetails.QUIZ_NAME_2, validDetails.DESCRIPTION_2);
    quiz3 = requestQuizCreate(userOne.token, validDetails.QUIZ_NAME_2, validDetails.DESCRIPTION_2);
    quiz4 = requestQuizCreate(userOne.token, 'quizthree', 'description3');
  });
  // Success cases for adminQuizTransfer
  describe('Success Cases', () => {
    test('Returns empty successfully', () => {
      expect(requestQuizTransfer(userOne.token, quiz1.quizId, validDetails.EMAIL_2)).toStrictEqual({});
    });

    test('Transfers one quiz correctly', () => {
      expect(requestQuizTransfer(userOne.token, quiz1.quizId, validDetails.EMAIL_2)).toStrictEqual({});
      expect(requestQuizList(userTwo.token)).toStrictEqual({
        quizzes: [
          {
            quizId: quiz1.quizId,
            name: validDetails.QUIZ_NAME
          },
          {
            quizId: quiz2.quizId,
            name: validDetails.QUIZ_NAME_2
          }
        ]
      });
      expect(requestQuizList(userOne.token)).toStrictEqual({
        quizzes: [
          {
            quizId: quiz3.quizId,
            name: validDetails.QUIZ_NAME_2
          },
          {
            quizId: quiz4.quizId,
            name: 'quizthree'
          }
        ]
      });
    });

    test('Transfers multiple quizzes correctly', () => {
      expect(requestQuizTransfer(userOne.token, quiz1.quizId, validDetails.EMAIL_2)).toStrictEqual({});
      expect(requestQuizTransfer(userOne.token, quiz4.quizId, validDetails.EMAIL_2)).toStrictEqual({});
      expect(requestQuizList(userTwo.token)).toStrictEqual({
        quizzes: [
          {
            quizId: quiz1.quizId,
            name: validDetails.QUIZ_NAME
          },
          {
            quizId: quiz2.quizId,
            name: validDetails.QUIZ_NAME_2
          },
          {
            quizId: quiz4.quizId,
            name: 'quizthree'
          }
        ]
      });
      expect(requestQuizList(userOne.token)).toStrictEqual({
        quizzes: [
          {
            quizId: quiz3.quizId,
            name: validDetails.QUIZ_NAME_2
          }
        ]
      });
    });
  });
  // Error cases for adminQuizTransfer
  describe('Error Cases', () => {
    test('Token is empty', () => {
      errorResult = requestQuizTransfer('', quiz1.quizId, validDetails.EMAIL_2);
      expect(errorResult.error).toStrictEqual(ERROR);
      expect(errorResult.statusCode).toStrictEqual(401);
    });

    test('Token is invalid', () => {
      errorResult = requestQuizTransfer(userOne.token + '1', quiz1.quizId, validDetails.EMAIL_2);
      expect(errorResult.error).toStrictEqual(ERROR);
      expect(errorResult.statusCode).toStrictEqual(401);
    });

    test('Quiz Id does not refer to a quiz that this user owns', () => {
      errorResult = requestQuizTransfer(userOne.token, quiz2.quizId, validDetails.EMAIL_2);
      expect(errorResult.error).toStrictEqual(ERROR);
      expect(errorResult.statusCode).toStrictEqual(403);
    });

    test('userEmail is not a real user', () => {
      errorResult = requestQuizTransfer(userOne.token, quiz1.quizId, 'ilovecats@gmail.com');
      expect(errorResult.error).toStrictEqual(ERROR);
      expect(errorResult.statusCode).toStrictEqual(400);
    });

    test('userEmail is the current logged in user', () => {
      errorResult = requestQuizTransfer(userOne.token, quiz1.quizId, validDetails.EMAIL);
      expect(errorResult.error).toStrictEqual(ERROR);
      expect(errorResult.statusCode).toStrictEqual(400);
    });

    test('Quiz ID refers to a quiz that has a name that is already used by the target user', () => {
      errorResult = requestQuizTransfer(userOne.token, quiz3.quizId, validDetails.EMAIL_2);
      expect(errorResult.error).toStrictEqual(ERROR);
      expect(errorResult.statusCode).toStrictEqual(400);
    });
  });
});
