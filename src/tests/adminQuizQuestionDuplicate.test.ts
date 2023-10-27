import {
  validDetails,
  QuizIdReturn,
  TokenReturn,
  ErrorObject,
  QuestionIdReturn,
} from '../types';

import {
  requestAuthRegister,
  requestQuizCreate,
  requestQuizInfo,
  requestLogout,
  requestQuestionCreate,
  requestClear,
  requestQuizQuestionDuplicate
} from './wrapper';

const ERROR = expect.any(String);

beforeEach(() => {
  requestClear();
});

describe('PUT /v1/admin/quiz/{quizid}/question/{questionid}/duplicate', () => {
  let userToken: TokenReturn;
  let userQuizId: QuizIdReturn;
  let questionId1: QuestionIdReturn;
  let questionId2: QuestionIdReturn;
  let errorReturn: ErrorObject;

  beforeEach(() => {
    userToken = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    userQuizId = requestQuizCreate(userToken.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
    questionId1 = requestQuestionCreate(userQuizId.quizId);
    questionId2 = requestQuestionCreate(userQuizId.quizId);
  });

  describe('Success Cases', () => {
    test('All inputs are valid', () => {
      const initialTime = requestQuizInfo(userToken.token, userQuizId.quizId).timeLastEdited;
      const questionIdNew = requestQuizQuestionDuplicate(userToken.token, userQuizId.quizId, questionId1.questionId);
      expect(questionIdNew).toEqual({ newQuestionId: expect.any(Number) });
      const timeLastEdited = requestQuizInfo(userToken.token, userQuizId.quizId).timeLastEdited;
      const quizQuestions = requestQuizInfo(userToken.token, userQuizId.quizId).questions;
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
      errorReturn = requestQuizQuestionDuplicate(userToken.token, userQuizId.quizId, -1);
      expect(errorReturn.error).toEqual(ERROR);
      expect(errorReturn.statusCode).toEqual(400);
    });

    test('Token is empty', () => {
      errorReturn = requestQuizQuestionDuplicate('', userQuizId.quizId, questionId1.questionId);
      expect(errorReturn.error).toEqual(ERROR);
      expect(errorReturn.statusCode).toEqual(401);
    });

    test.skip('Token does not refer to valid logged in user session', () => {
      requestLogout(userToken.token);
      errorReturn = requestQuizQuestionDuplicate(userToken.token, userQuizId.quizId, questionId1.questionId);
      expect(errorReturn.error).toEqual(ERROR);
      expect(errorReturn.statusCode).toEqual(401);
    });

    test('Valid token is provided, but user is not an owner of this quiz', () => {
      const noQuizzesUserToken = requestAuthRegister(validDetails.EMAIL_2, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
      errorReturn = requestQuizQuestionDuplicate(noQuizzesUserToken.token, userQuizId.quizId, questionId1.questionId);
      expect(errorReturn.error).toEqual(ERROR);
      expect(errorReturn.statusCode).toEqual(403);
    });
  });
});
