import {
  TokenReturn,
  QuizIdReturn,
  validDetails
} from '../types';

import {
  requestClear,
  requestAuthRegister,
  requestQuizCreate,
  requestQuizInfo,
  requestThumbnailUpdate
} from './wrapper';

import HTTPError from 'http-errors';

afterEach(() => {
  requestClear();
});

describe('Tests for /v1/admin/quiz/{quizid}/thumbnail', () => {
  let user: TokenReturn;
  let quiz: QuizIdReturn;
  let noQuizzesUser: QuizIdReturn;
  const validUrl = 'http://google.com/some/image/path.jpg';
  const invalidFileTypeUrl = 'http://google.com/some/image/path';
  const invalidProtocolUrl = 'google.com/some/image/path.jpg';
  beforeEach(() => {
    requestClear();
    user = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    quiz = requestQuizCreate(user.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
    noQuizzesUser = requestAuthRegister(validDetails.EMAIL_2, validDetails.PASSWORD_2, validDetails.FIRST_NAME_2, validDetails.LAST_NAME_2);
  });

  describe('Success Cases', () => {
    const initialTime = requestQuizInfo(user.token, quiz.quizId).timeLastEdited;
    expect(requestThumbnailUpdate(user.token, quiz.quizId, validUrl)).toStrictEqual({});
    const updatedQuiz = requestQuizInfo(user.token, quiz.quizId);
    expect(updatedQuiz.thumbnailUrl).toStrictEqual(validUrl);
    expect(updatedQuiz.timeLastEdited).toBeGreaterThanOrEqual(initialTime);
    expect(updatedQuiz.timeLastEdited).toBeLessThanOrEqual(initialTime + 1);
  });
  describe('Error Cases', () => {
    test('The imgUrl does not end with one of the following filetypes (case insensitive): jpg, jpeg, png', () => {
      expect(() => requestThumbnailUpdate(user.token, quiz.quizId, invalidFileTypeUrl)).toThrow(HTTPError[400]);
    });

    test('The imgUrl does not begin with http:// or https://', () => {
      expect(() => requestThumbnailUpdate(user.token, quiz.quizId, invalidProtocolUrl)).toThrow(HTTPError[400]);
    });

    test('Token is empty', () => {
      expect(() => requestThumbnailUpdate('', quiz.quizId, validUrl)).toThrow(HTTPError[401]);
    });

    test('Token is invalid', () => {
      expect(() => requestThumbnailUpdate(user.token + 1, quiz.quizId, validUrl)).toThrow(HTTPError[401]);
    });

    test('Valid token is provided, but user is not an owner of this quiz', () => {
      expect(() => requestThumbnailUpdate(noQuizzesUser.token, quiz.quizId, validUrl)).toThrow(HTTPError[403]);
    });
  });
});
