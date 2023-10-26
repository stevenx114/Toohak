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
  requestClear,
  requestQuizDescriptionUpdate,
  requestQuizRemove,
  requestQuizList,
  requestQuizNameUpdate,
  requestLogout,
} from './wrapper';

import {
  Quiz,
} from '../dataStore';

const ERROR = expect.any(String);

beforeEach(() => {
  requestClear();
});

describe('PUT /v1/admin/quiz/{quizid}/question/{questionId}/move', () => {
  let userToken: TokenReturn;
  let userQuizId: QuizIdReturn;
  let questionId1: QuestionIdReturn;
  let questionId2: QuestionIdReturn;
  let questionId3: QuestionIdReturn;
  let errorReturn: ErrorObject;

  beforeEach(() => {
    userToken = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    userQuizId = requestQuizCreate(userToken.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
    questionId1 = requestQuestionCreate(userQuizId.quizId);
    questionId2 = requestQuestionCreate(userQuizId.quizId);
    questionId3 = requestQuestionCreate(userQuizId.quizId);
  });

  describe('Success Cases', () => {
    test('All inputs are valid', () => {
      expect(requestQuizQuestionMove(userToken.token, userQuizId.quizId, questionId3.questionId, 0)).toEqual({});
      const quizQuestions = requestQuizInfo(userToken.token, userQuizId.quizId).questions;
      const quizQuestionIds = quizQuestions.map(q => q.questionId);
      expect(quizQuestionIds.indexOf(questionId3.questionId)).toEqual(0);
      expect(quizQuestionIds.indexOf(questionId1.questionId)).toEqual(1);
      expect(quizQuestionIds.indexOf(questionId2.questionId)).toEqual(2);
    })
  });

  describe('Error Cases', () => {
    test('Question Id does not refer to a valid question within this quiz', () => {
      errorReturn = requestQuizQuestionMove(userToken.token, userQuizId.quizId, -1, 0);
      expect(errorReturn.error).toEqual(ERROR);
      expect(errorReturn.statusCode).toEqual(400);
    });

    test('NewPosition is less than 0', () => {
      errorReturn = requestQuizQuestionMove(userToken.token, userQuizId.quizId, questionId3.questionId, -1);
      expect(errorReturn.error).toEqual(ERROR);
      expect(errorReturn.statusCode).toEqual(400);
    });
    
    test('NewPosition is greater than n-1 where n is the number of questions', () => {
      errorReturn = requestQuizQuestionMove(userToken.token, userQuizId.quizId, questionId3.questionId, 4);
      expect(errorReturn.error).toEqual(ERROR);
      expect(errorReturn.statusCode).toEqual(400);
    });

    test('Token is empty', () => {
      errorReturn = requestQuizQuestionMove('', userQuizId.quizId, questionId3.questionId, 0);
      expect(errorReturn.error).toEqual(ERROR);
      expect(errorReturn.statusCode).toEqual(401);
    });

    test.skip('Token does not refer to valid logged in user session', () => {
      requestLogout(userToken.token);
      errorReturn = requestQuizQuestionMove(userToken.token, userQuizId.quizId, questionId3.questionId, 0);
      expect(errorResult.error).toEqual(ERROR);
      expect(errorResult.statusCode).toEqual(401);
    });

    test('Valid token is provided, but user is not an owner of this quiz', () => {
      const noQuizzesUserToken = requestAuthRegister(validDetails.EMAIL_2, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
      errorReturn = requestQuizQuestionMove(noQuizzesUserToken.token, userQuizId.quizId, questionId3.questionId, 0);
      expect(errorReturn.error).toEqual(ERROR);
      expect(errorReturn.statusCode).toEqual(403);
    });
  });
});