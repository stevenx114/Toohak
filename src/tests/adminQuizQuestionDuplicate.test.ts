import {
  validDetails,
  QuizIdReturn,
  TokenReturn,
  QuestionIdReturn,
  VALID_Q_BODY_1,
  VALID_Q_BODY_2
} from '../types';

import {
  requestAuthRegister,
  requestQuizCreate,
  requestQuizInfo,
  requestLogout,
  requestQuizQuestionCreate,
  requestClear,
  requestQuizQuestionDuplicate
} from './wrapper';

import {
  Question
} from '../dataStore';

import HTTPError from 'http-errors';

afterEach(() => {
  requestClear();
});

describe('PUT /v1/admin/quiz/{quizid}/question/{questionid}/duplicate', () => {
  let userToken: TokenReturn;
  let userQuizId: QuizIdReturn;
  let questionId1: QuestionIdReturn;
  let questionId2: QuestionIdReturn;
  let quizQuestions: Question[];
  beforeEach(() => {
    requestClear();
    userToken = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    userQuizId = requestQuizCreate(userToken.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
    questionId1 = requestQuizQuestionCreate(userToken.token, userQuizId.quizId, VALID_Q_BODY_1);
    questionId2 = requestQuizQuestionCreate(userToken.token, userQuizId.quizId, VALID_Q_BODY_2);
  });

  describe('Success Cases', () => {
    test('All inputs are valid', () => {
      const initialTime = requestQuizInfo(userToken.token, userQuizId.quizId).timeLastEdited;
      const questionIdNew = requestQuizQuestionDuplicate(userToken.token, userQuizId.quizId, questionId1.questionId);
      expect(questionIdNew).toEqual({ newQuestionId: expect.any(Number) });
      const timeLastEdited = requestQuizInfo(userToken.token, userQuizId.quizId).timeLastEdited;
      quizQuestions = requestQuizInfo(userToken.token, userQuizId.quizId).questions;
      const quizQuestionIds = quizQuestions.map(q => q.questionId);
      expect(quizQuestionIds.indexOf(questionId1.questionId)).toEqual(0);
      expect(quizQuestionIds.indexOf(questionIdNew.newQuestionId)).toEqual(1);
      expect(quizQuestionIds.indexOf(questionId2.questionId)).toEqual(2);
      expect(timeLastEdited).toBeGreaterThanOrEqual(initialTime);
      expect(timeLastEdited).toBeLessThanOrEqual(initialTime + 1);
    });
  });

  describe('Error Cases', () => {
    test('Question Id does not refer to a valid question within this quiz', () => {
      expect(() => requestQuizQuestionDuplicate(userToken.token, userQuizId.quizId, -1)).toThrow(HTTPError[400]);
    });

    test('Token is empty', () => {
      expect(() => requestQuizQuestionDuplicate('', userQuizId.quizId, questionId1.questionId)).toThrow(HTTPError[401]);
    });

    test('Token does not refer to valid logged in user session', () => {
      requestLogout(userToken.token);
      expect(() => requestQuizQuestionDuplicate(userToken.token, userQuizId.quizId, questionId1.questionId)).toThrow(HTTPError[401]);
    });

    test('Valid token is provided, but user is not an owner of this quiz', () => {
      const noQuizzesUserToken = requestAuthRegister(validDetails.EMAIL_2, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
      expect(() => requestQuizQuestionDuplicate(noQuizzesUserToken.token, userQuizId.quizId, questionId1.questionId)).toThrow(HTTPError[403]);
    });
  });
});
