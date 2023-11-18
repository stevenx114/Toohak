import {
  validDetails,
  QuizIdReturn,
  TokenReturn,
  sessionState,
  QuestionBody,
} from '../types';

import {
  requestAuthRegister,
  requestQuizCreateV2,
  requestClear,
  requestQuizRemoveV2,
  requestQuizListV2,
  requestQuizSessionStart,
  requestSessionStateUpdate,
  requestQuizQuestionCreateV2
} from './wrapper';

import HTTPError from 'http-errors';

afterEach(() => {
  requestClear();
});

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

const autoStart = 3;

// Tests for adminQuizRemove function
describe('DELETE /v2/admin/quiz/{quizid}', () => {
  let ownsQuizUserToken: TokenReturn;
  let noQuizUserToken: TokenReturn;
  let quizOneId: QuizIdReturn;
  let quizTwoId: QuizIdReturn;
  beforeEach(() => {
    requestClear();
    ownsQuizUserToken = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    noQuizUserToken = requestAuthRegister(validDetails.EMAIL_2, validDetails.PASSWORD_2, validDetails.FIRST_NAME_2, validDetails.LAST_NAME_2);
    quizOneId = requestQuizCreateV2(ownsQuizUserToken.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
    quizTwoId = requestQuizCreateV2(ownsQuizUserToken.token, validDetails.QUIZ_NAME_2, validDetails.DESCRIPTION_2);
  });
  describe('Success cases', () => {
    test('Successful removal of quiz one', () => {
      requestQuizRemoveV2(ownsQuizUserToken.token, quizOneId.quizId);
      expect(requestQuizListV2(ownsQuizUserToken.token)).toStrictEqual({
        quizzes: [
          {
            quizId: quizTwoId.quizId,
            name: validDetails.QUIZ_NAME_2
          }
        ]
      });
    });
    test('Successful removal of quiz two', () => {
      expect(requestQuizRemoveV2(ownsQuizUserToken.token, quizTwoId.quizId)).toEqual({});
      expect(requestQuizListV2(ownsQuizUserToken.token)).toStrictEqual({
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
      expect(() => requestQuizRemoveV2('', quizOneId.quizId)).toThrow(HTTPError[401]);
    });
    test('Token is invalid', () => {
      expect(() => requestQuizRemoveV2(ownsQuizUserToken.token + '1', quizOneId.quizId)).toThrow(HTTPError[401]);
    });
    test('Quiz Id does not refer to a quiz that this user owns', () => {
      expect(() => requestQuizRemoveV2(noQuizUserToken.token, quizOneId.quizId)).toThrow(HTTPError[403]);
    });
    test('All sessions for this quiz must be in END state', () => {
      requestQuizQuestionCreateV2(ownsQuizUserToken.token, quizOneId.quizId, VALID_Q_BODY);
      const sessionIdOne = requestQuizSessionStart(ownsQuizUserToken.token, quizOneId.quizId, autoStart).sessionId;
      requestQuizSessionStart(ownsQuizUserToken.token, quizOneId.quizId, autoStart);
      requestSessionStateUpdate(ownsQuizUserToken.token, quizOneId.quizId, sessionIdOne, sessionState.END);
      expect(() => requestQuizRemoveV2(ownsQuizUserToken.token, quizOneId.quizId)).toThrow(HTTPError[400]);
    });
  });
});
