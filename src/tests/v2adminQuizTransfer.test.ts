import {
  validDetails,
  TokenReturn,
  QuizIdReturn,
} from '../types';

import {
  requestAuthRegister,
  requestQuizCreateV2,
  requestClear,
  requestQuizTransferV2,
  requestQuizListV2
} from './wrapper';

import HTTPError from 'http-errors';

beforeEach(() => {
  requestClear();
});

afterEach(() => {
  requestClear();
});

// Tests for adminQuizTransfer function
describe('POST v2/admin/quiz/:quizid/transfer', () => {
  let userOne: TokenReturn;
  let userTwo: TokenReturn;
  let quiz1: QuizIdReturn;
  let quiz2: QuizIdReturn;
  let quiz3: QuizIdReturn;
  let quiz4: QuizIdReturn;

  beforeEach(() => {
    userOne = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    userTwo = requestAuthRegister(validDetails.EMAIL_2, validDetails.PASSWORD_2, validDetails.FIRST_NAME_2, validDetails.LAST_NAME_2);
    quiz1 = requestQuizCreateV2(userOne.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
    quiz2 = requestQuizCreateV2(userTwo.token, validDetails.QUIZ_NAME_2, validDetails.DESCRIPTION_2);
    quiz3 = requestQuizCreateV2(userOne.token, validDetails.QUIZ_NAME_2, validDetails.DESCRIPTION_2);
    quiz4 = requestQuizCreateV2(userOne.token, 'quizthree', 'description3');
  });
  // Success cases for adminQuizTransfer
  describe('Success Cases', () => {
    test('Returns empty successfully', () => {
      expect(requestQuizTransferV2(userOne.token, quiz1.quizId, validDetails.EMAIL_2)).toStrictEqual({});
    });

    test('Transfers one quiz correctly', () => {
      expect(requestQuizTransferV2(userOne.token, quiz1.quizId, validDetails.EMAIL_2)).toStrictEqual({});
      expect(requestQuizListV2(userTwo.token)).toStrictEqual({
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
      expect(requestQuizListV2(userOne.token)).toStrictEqual({
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
      expect(requestQuizTransferV2(userOne.token, quiz1.quizId, validDetails.EMAIL_2)).toStrictEqual({});
      expect(requestQuizTransferV2(userOne.token, quiz4.quizId, validDetails.EMAIL_2)).toStrictEqual({});
      expect(requestQuizListV2(userTwo.token)).toStrictEqual({
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
      expect(requestQuizListV2(userOne.token)).toStrictEqual({
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
      expect(() => requestQuizTransferV2('', quiz1.quizId, validDetails.EMAIL_2)).toThrow(HTTPError[401]);
    });

    test('Token is invalid', () => {
      expect(() => requestQuizTransferV2(userOne.token + '1', quiz1.quizId, validDetails.EMAIL_2)).toThrow(HTTPError[401]);
    });

    test('Quiz Id does not refer to a quiz that this user owns', () => {
      expect(() => requestQuizTransferV2(userOne.token, quiz2.quizId, validDetails.EMAIL_2)).toThrow(HTTPError[403]);
    });

    test('userEmail is not a real user', () => {
      expect(() => requestQuizTransferV2(userOne.token, quiz1.quizId, 'ilovecats@gmail.com')).toThrow(HTTPError[400]);
    });

    test('userEmail is the current logged in user', () => {
      expect(() => requestQuizTransferV2(userOne.token, quiz1.quizId, validDetails.EMAIL)).toThrow(HTTPError[400]);
    });

    test('Quiz ID refers to a quiz that has a name that is already used by the target user', () => {
      expect(() => requestQuizTransferV2(userOne.token, quiz3.quizId, validDetails.EMAIL_2)).toThrow(HTTPError[400]);
    });
  });
});
