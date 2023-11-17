import {
  validDetails,
  QuizIdReturn,
  TokenReturn,
  QuestionIdReturn,
  QuestionBody,
  VALID_Q_BODY_1,
  VALID_Q_BODY_2,
  VALID_Q_BODY_3
} from '../types';

import {
  requestAuthRegister,
  requestQuizCreateV2,
  requestQuizInfoV2,
  requestLogoutV2,
  requestQuizQuestionMoveV2,
  requestQuizQuestionCreateV2,
  requestClear
} from './wrapper';

import {
  Question
} from '../dataStore';

import HTTPError from 'http-errors';

beforeEach(() => {
  requestClear();
});

afterEach(() => {
  requestClear();
});

describe('PUT /v1/admin/quiz/{quizid}/question/{questionid}/move', () => {
  let userToken: TokenReturn;
  let userQuizId: QuizIdReturn;
  let questionId1: QuestionIdReturn;
  let questionId2: QuestionIdReturn;
  let questionId3: QuestionIdReturn;
  beforeEach(() => {
    userToken = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    userQuizId = requestQuizCreateV2(userToken.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
    questionId1 = requestQuizQuestionCreateV2(userToken.token, userQuizId.quizId, VALID_Q_BODY_1);
    questionId2 = requestQuizQuestionCreateV2(userToken.token, userQuizId.quizId, VALID_Q_BODY_2);
    questionId3 = requestQuizQuestionCreateV2(userToken.token, userQuizId.quizId, VALID_Q_BODY_3);
  });

  describe('Success Cases', () => {
    test('All inputs are valid', () => {
      expect(requestQuizQuestionMoveV2(userToken.token, userQuizId.quizId, questionId3.questionId, 0)).toEqual({});
      const quizQuestions: Question[] = requestQuizInfoV2(userToken.token, userQuizId.quizId).questions;
      const quizQuestionIds = quizQuestions.map(q => q.questionId);
      expect(quizQuestionIds.indexOf(questionId3.questionId)).toEqual(0);
      expect(quizQuestionIds.indexOf(questionId1.questionId)).toEqual(1);
      expect(quizQuestionIds.indexOf(questionId2.questionId)).toEqual(2);
    });
  });

  describe('Error Cases', () => {
    test('Question Id does not refer to a valid question within this quiz', () => {
      expect(() => requestQuizQuestionMoveV2(userToken.token, userQuizId.quizId, -1, 0)).toThrow(HTTPError[400]);
    });

    test('NewPosition is less than 0', () => {
      expect(() => requestQuizQuestionMoveV2(userToken.token, userQuizId.quizId, questionId3.questionId, -1)).toThrow(HTTPError[400]);
    });

    test('NewPosition is greater than n-1 where n is the number of questions', () => {
      expect(() => requestQuizQuestionMoveV2(userToken.token, userQuizId.quizId, questionId3.questionId, 4)).toThrow(HTTPError[400]);
    });

    test('NewPosition cannot be the position of the current question', () => {
      expect(() => requestQuizQuestionMoveV2(userToken.token, userQuizId.quizId, questionId3.questionId, 2)).toThrow(HTTPError[400]);
    });

    test('Token is empty', () => {
      expect(() => requestQuizQuestionMoveV2('', userQuizId.quizId, questionId3.questionId, 0)).toThrow(HTTPError[401]);
    });

    test('Token does not refer to valid logged in user session', () => {
      requestLogoutV2(userToken.token);
      expect(() => requestQuizQuestionMoveV2(userToken.token, userQuizId.quizId, questionId3.questionId, 0)).toThrow(HTTPError[401]);
    });

    test('Valid token is provided, but user is not an owner of this quiz', () => {
      const noQuizzesUserToken = requestAuthRegister(validDetails.EMAIL_2, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
      expect(() => requestQuizQuestionMoveV2(noQuizzesUserToken.token, userQuizId.quizId, questionId3.questionId, 0)).toThrow(HTTPError[403]);
    });
  });
});
