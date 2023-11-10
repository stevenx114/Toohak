import {
  validDetails,
  TokenReturn,
  ErrorObject
} from '../types';

import {
  requestAuthRegister,
  requestQuizCreate,
  requestClear,
  requestPlayerJoin,
} from './wrapper';

import HTTPError from 'http-errors';

interface QuizId { quizId: number };
interface TokenObject { token: string };
interface SessionObject { sessionId: number };

const ERROR = expect.any(String);
const NAME = expect.any(String);

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
  thumbnailURL: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png'
};

// Tests for playerJoin function
describe('POST v1/player/join', () => {
  let user: TokenObject;
  let quiz: QuizId;
  beforeEach(() => {
    requestClear();
    user = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    quiz = requestQuizCreate(user.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
    requestCreateQuestionV2(user.token, quiz.quizId, QUESTION_BODY_1);
    const sessionId: SessionObject = requestSessionStart(user.token, quiz.quizId, 1); // status - ACTIVE
  });

  // Error Cases
  test('Session is not in LOBBY state', () => {
    requestSessionStateUpdateV1(user.token, quizId.quizId, sessionId.sessionId, 'END');// status - END
    expect(() => requestPlayerJoin(sessionId.sessionId, 'harry mcClary').toThrow(HTTPError[400]));
  });

  // Check for unique name - need to confirm data

  // Success Cases
  test('Correct output with empty name', () => {
    expect(requestPlayerJoin(sessionId.sessionId, '')).toStrictEqual({
      playerId: NAME
    })
  });

  test('Correct output with name', () => {
    expect(requestPlayerJoin(sessionId.sessionId, 'Max Lee')).toStrictEqual({
      playerId: NAME
    })
  });
  
});