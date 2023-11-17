import {
  validDetails,
  QuizIdReturn,
  TokenReturn,
  QuestionIdReturn,
  QuestionBody
} from '../types';

import {
  requestAuthRegister,
  requestQuizCreate,
  requestQuizInfo,
  requestLogout,
  requestQuizQuestionMove,
  requestQuizQuestionCreate,
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
  const VALID_Q_BODY_1: QuestionBody = {
    question: 'question1',
    duration: 3,
    points: 3,
    answers: [
      {
        answer: 'answer1',
        correct: false
      },
      {
        answer: 'answer2',
        correct: true
      }
    ]
  };
  const VALID_Q_BODY_2: QuestionBody = {
    question: 'question2',
    duration: 4,
    points: 4,
    answers: [
      {
        answer: 'answer1',
        correct: false
      },
      {
        answer: 'answer2',
        correct: true
      }
    ]
  };
  const VALID_Q_BODY_3: QuestionBody = {
    question: 'question3',
    duration: 5,
    points: 5,
    answers: [
      {
        answer: 'answer1',
        correct: false
      },
      {
        answer: 'answer2',
        correct: true
      }
    ]
  };

  beforeEach(() => {
    userToken = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    userQuizId = requestQuizCreate(userToken.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
    questionId1 = requestQuizQuestionCreate(userToken.token, userQuizId.quizId, VALID_Q_BODY_1);
    questionId2 = requestQuizQuestionCreate(userToken.token, userQuizId.quizId, VALID_Q_BODY_2);
    questionId3 = requestQuizQuestionCreate(userToken.token, userQuizId.quizId, VALID_Q_BODY_3);
  });

  describe('Success Cases', () => {
    test('All inputs are valid', () => {
      expect(requestQuizQuestionMove(userToken.token, userQuizId.quizId, questionId3.questionId, 0)).toEqual({});
      const quizQuestions: Question[] = requestQuizInfo(userToken.token, userQuizId.quizId).questions;
      const quizQuestionIds = quizQuestions.map(q => q.questionId);
      expect(quizQuestionIds.indexOf(questionId3.questionId)).toEqual(0);
      expect(quizQuestionIds.indexOf(questionId1.questionId)).toEqual(1);
      expect(quizQuestionIds.indexOf(questionId2.questionId)).toEqual(2);
    });
  });

  describe('Error Cases', () => {
    test('Question Id does not refer to a valid question within this quiz', () => {
      expect(() => requestQuizQuestionMove(userToken.token, userQuizId.quizId, -1, 0)).toThrow(HTTPError[400]);
    });

    test('NewPosition is less than 0', () => {
      expect(() => requestQuizQuestionMove(userToken.token, userQuizId.quizId, questionId3.questionId, -1)).toThrow(HTTPError[400]);
    });

    test('NewPosition is greater than n-1 where n is the number of questions', () => {
      expect(() => requestQuizQuestionMove(userToken.token, userQuizId.quizId, questionId3.questionId, 4)).toThrow(HTTPError[400]);
    });

    test('NewPosition cannot be the position of the current question', () => {
      expect(() => requestQuizQuestionMove(userToken.token, userQuizId.quizId, questionId3.questionId, 2)).toThrow(HTTPError[400]);
    });

    test('Token is empty', () => {
      expect(() => requestQuizQuestionMove('', userQuizId.quizId, questionId3.questionId, 0)).toThrow(HTTPError[401]);
    });

    test('Token does not refer to valid logged in user session', () => {
      requestLogout(userToken.token);
      expect(() => requestQuizQuestionMove(userToken.token, userQuizId.quizId, questionId3.questionId, 0)).toThrow(HTTPError[401]);
    });

    test('Valid token is provided, but user is not an owner of this quiz', () => {
      const noQuizzesUserToken = requestAuthRegister(validDetails.EMAIL_2, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
      expect(() => requestQuizQuestionMove(noQuizzesUserToken.token, userQuizId.quizId, questionId3.questionId, 0)).toThrow(HTTPError[403]);
    });
  });
});
