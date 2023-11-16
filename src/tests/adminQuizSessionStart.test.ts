import {
  validDetails,
  QuestionBody,
  TokenReturn,
  QuizIdReturn,
  SessionIdReturn,
  sessionState
} from '../types';

import {
  requestClear,
  requestAuthRegister,
  requestQuizQuestionCreate,
  requestQuizCreate,
  requestQuizSessionStart,
  requestSessionStatus
} from './wrapper';

import HTTPError from 'http-errors';

const NUMBER = expect.any(Number);

const validAutoStartNum = 5;

const VALID_Q_BODY: QuestionBody = {
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

afterEach(() => {
  requestClear();
});

describe('Tests for /v1/admin/quiz/{quizid}/session/start', () => {
  let user: TokenReturn;
  let quiz: QuizIdReturn;
  let noQuizzesUser: TokenReturn;
  let noQuestionsQuiz: QuizIdReturn;
  let session: SessionIdReturn;

  beforeEach(() => {
    requestClear();
    user = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    quiz = requestQuizCreate(user.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
    requestQuizQuestionCreate(user.token, quiz.quizId, VALID_Q_BODY);
    noQuizzesUser = requestAuthRegister(validDetails.EMAIL_2, validDetails.PASSWORD_2, validDetails.FIRST_NAME_2, validDetails.LAST_NAME_2);
    noQuestionsQuiz = requestQuizCreate(user.token, validDetails.QUIZ_NAME_2, validDetails.DESCRIPTION);
  });

  describe('Success Cases', () => {
    test('Successful session start', () => {
      session = requestQuizSessionStart(user.token, quiz.quizId, validAutoStartNum);
      expect(session).toStrictEqual({ sessionId: NUMBER });
      expect(requestSessionStatus(user.token, quiz.quizId, session.sessionId).state).toStrictEqual(sessionState.LOBBY);
    });
  });

  describe('Error Cases', () => {
    test('autoStartNum is a number greater than 50', () => {
      expect(() => requestQuizSessionStart(user.token, quiz.quizId, 51)).toThrow(HTTPError[400]);
    });

    test('A maximum of 10 sessions that are not in END state currently exist for this quiz', () => {
      for (let i = 0; i < 10; i++) {
        requestQuizSessionStart(user.token, quiz.quizId, validAutoStartNum);
      }
      expect(() => requestQuizSessionStart(user.token, quiz.quizId, validAutoStartNum)).toThrow(HTTPError[400]);
    });

    test('The quiz does not have any questions in it', () => {
      expect(() => requestQuizSessionStart(user.token, noQuestionsQuiz.quizId, validAutoStartNum)).toThrow(HTTPError[400]);
    });

    test('Token is empty', () => {
      expect(() => requestQuizSessionStart('', quiz.quizId, validAutoStartNum)).toThrow(HTTPError[401]);
    });

    test('Token is invalid', () => {
      expect(() => requestQuizSessionStart(user.token + 1, quiz.quizId, validAutoStartNum)).toThrow(HTTPError[401]);
    });

    test('Valid token is provided, but user is not an owner of this quiz', () => {
      expect(() => requestQuizSessionStart(noQuizzesUser.token, quiz.quizId, validAutoStartNum)).toThrow(HTTPError[403]);
    });
  });
});
