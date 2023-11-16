import {
  validDetails,
  TokenReturn,
  ErrorObject,
  QuizIdReturn,
  QuestionBody
} from '../types';

import {
  requestAuthRegister,
  requestQuizCreateV2,
  requestClear,
  requestQuizSessionView,
  requestLogoutV2,
  requestQuizQuestionCreateV2,
  requestQuizSessionStart,
  requestSessionStateUpdate
} from './wrapper';  

import HTTPError from 'http-errors';

interface QuizId { quizId: number };
interface TokenObject { token: string };
interface SessionObject { sessionId: number };

const ERROR = expect.any(String);

const QUESTION_BODY_1: QuestionBody = {
  question: 'question',
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
  ],
  thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png'
};
const QUESTION_BODY_2: QuestionBody = {
  question: 'question2',
  duration: 6,
  points: 2,
  answers: [
    {
      answer: 'hello',
      correct: false
    },
    {
      answer: 'hi',
      correct: true
    },
    {
      answer: 'nice',
      correct: true
    }
  ],
  thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png'
};
const QUESTION_BODY_3: QuestionBody = {
  question: 'question3',
  duration: 11,
  points: 9,
  answers: [
    {
      answer: 'too many',
      correct: true
    },
    {
      answer: 'lets go',
      correct: true
    }
  ],
  thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png'
};

afterEach(() => {
    requestClear();
});

// Tests for adminQuizSessionView
describe('GET adminQuizSessionView', () => {
  let user: TokenObject;
  let quiz: QuizId;
  beforeEach(() => {
    requestClear();
    user = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    quiz = requestQuizCreateV2(user.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
    requestQuizQuestionCreateV2(user.token, quiz.quizId, QUESTION_BODY_1);
  });

  // Error Cases
  test('Token is empty', () => {
    expect(() => requestQuizSessionView(quiz.quizId, '')).toThrow(HTTPError[401]);
  });

  test('Valid token but not for logged in user', () => {
    requestLogoutV2(user.token);
    expect(() => requestQuizSessionView(quiz.quizId, user.token)).toThrow(HTTPError[401]);
  });

  test('Valid token but not the correct quiz owner', () => {
    const user1: TokenObject = requestAuthRegister(validDetails.EMAIL_2, validDetails.PASSWORD_2, validDetails.FIRST_NAME_2, validDetails.LAST_NAME_2);
    // Try to add question into another quiz from the second user.
    expect(() => requestQuizSessionView(quiz.quizId, user1.token)).toThrow(HTTPError[403]);
  });

  // Success Case
  test('Successfully return list of sessions across multiple quizzes', () => {
    const quiz2: QuizId = requestQuizCreateV2(user.token, 'human history', 'description 2');
    requestQuizQuestionCreateV2(user.token, quiz2.quizId, QUESTION_BODY_2);
    const quiz3: QuizId = requestQuizCreateV2(user.token, 'dinosaurs', 'description 3');
    requestQuizQuestionCreateV2(user.token, quiz3.quizId, QUESTION_BODY_3);

    // Start session for quiz1
    const sessionId: SessionObject = requestQuizSessionStart(user.token, quiz.quizId, 1);
    const sessionId2: SessionObject = requestQuizSessionStart(user.token, quiz.quizId, 2);
    const sessionId3: SessionObject = requestQuizSessionStart(user.token, quiz.quizId, 3);
    const sessionId4: SessionObject = requestQuizSessionStart(user.token, quiz.quizId, 4);
    requestSessionStateUpdate(user.token, quiz.quizId, sessionId2.sessionId, 'END');
    requestSessionStateUpdate(user.token, quiz.quizId, sessionId4.sessionId, 'END');

    // Start session for quiz2
    const sessionId5: SessionObject = requestQuizSessionStart(user.token, quiz2.quizId, 5);
    const sessionId6: SessionObject = requestQuizSessionStart(user.token, quiz2.quizId, 6);

    // Start session for quiz3
    const sessionId7: SessionObject = requestQuizSessionStart(user.token, quiz3.quizId, 7);
    const sessionId8: SessionObject = requestQuizSessionStart(user.token, quiz3.quizId, 8);
    requestSessionStateUpdate(user.token, quiz3.quizId, sessionId7.sessionId, 'END');
    requestSessionStateUpdate(user.token, quiz3.quizId, sessionId8.sessionId, 'END');

    // Quiz 1
    expect(requestQuizSessionView(quiz.quizId, user.token)).toStrictEqual({
      activeSessions: [
        sessionId.sessionId,
        sessionId3.sessionId
      ],
      inactiveSessions: [
        sessionId2.sessionId,
        sessionId4.sessionId
      ]
    });

    // Quiz 2
    expect(requestQuizSessionView(quiz2.quizId, user.token)).toStrictEqual({
      activeSessions: [
        sessionId5.sessionId,
        sessionId6.sessionId
      ],
      inactiveSessions: []
    });

    // Quiz 3
    expect(requestQuizSessionView(quiz3.quizId, user.token)).toStrictEqual({
      activeSessions: [],
      inactiveSessions: [
        sessionId7.sessionId,
        sessionId8.sessionId
      ]
    });
  });
}); 