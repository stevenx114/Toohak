import {
  validDetails,
  QuestionBody,
} from '../types';

import {
  requestAuthRegister,
  requestQuizCreateV2,
  requestClear,
  requestPlayerJoin,
  requestQuizSessionStart,
  requestSessionStateUpdate,
  requestQuizQuestionCreateV2
} from './wrapper';

import HTTPError from 'http-errors';

interface QuizId { quizId: number }
interface TokenObject { token: string }
interface SessionObject { sessionId: number }

const NUMBER = expect.any(Number);

// Valid constants
const VALID_NAME = 'Tom Boy';
const VALID_QUESTION_BODY: QuestionBody = {
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

// Tests for playerJoin function
describe('POST v1/player/join', () => {
  let user: TokenObject;
  let quiz: QuizId;
  let sessionId: SessionObject;
  beforeEach(() => {
    requestClear();
    user = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    quiz = requestQuizCreateV2(user.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
    requestQuizQuestionCreateV2(user.token, quiz.quizId, VALID_QUESTION_BODY);
    sessionId = requestQuizSessionStart(user.token, quiz.quizId, 1); // status - ACTIVE
  });

  // Error Cases
  test('Session is not in LOBBY state', () => {
    requestSessionStateUpdate(user.token, quiz.quizId, sessionId.sessionId, 'END');// status - END
    expect(() => requestPlayerJoin(sessionId.sessionId, 'harry mcClary')).toThrow(HTTPError[400]);
  });

  test('Name is not unique', () => {
    requestPlayerJoin(sessionId.sessionId, VALID_NAME);
    expect(() => requestPlayerJoin(sessionId.sessionId, VALID_NAME)).toThrow(HTTPError[400]);
  });

  // Success Cases
  test.each([
    ['name with number', 'Max123'],
    ['name with spaces', 'Max Lee'],
    ['name in CAPS', 'MAXLEE'],
    ['name is empty', ''],
  ])('%s', (test, name) => {
    expect(requestPlayerJoin(sessionId.sessionId, name)).toStrictEqual({ playerId: NUMBER });
  });
});
