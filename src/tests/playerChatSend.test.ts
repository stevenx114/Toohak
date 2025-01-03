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
  requestQuizQuestionCreateV2,
  requestPlayerChatSend
} from './wrapper';

import HTTPError from 'http-errors';

interface QuizId { quizId: number }
interface TokenObject { token: string }
interface SessionObject { sessionId: number }
interface PlayerObject { playerId: number }

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

const validMessage = 'Hello World!';

let user: TokenObject;
let quiz: QuizId;
let sessionId: SessionObject;
let player: PlayerObject;

beforeEach(() => {
  requestClear();
  user = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
  quiz = requestQuizCreateV2(user.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
  requestQuizQuestionCreateV2(user.token, quiz.quizId, VALID_QUESTION_BODY);
  sessionId = requestQuizSessionStart(user.token, quiz.quizId, 1); // status - ACTIVE
  player = requestPlayerJoin(sessionId.sessionId, VALID_NAME);
});

afterEach(() => {
  requestClear();
});

describe('Tests for POST /v1/player/:playerid/chat', () => {
  describe('Success Case', () => {
    test('Correct return object', () => {
      expect(requestPlayerChatSend(player.playerId, validMessage)).toStrictEqual({
        message: {
          messageBody: validMessage
        }
      });
    });
  });
  describe('Error Cases', () => {
    test('Player ID does not exist', () => {
      expect(() => requestPlayerChatSend(player.playerId + 1, validMessage)).toThrow(HTTPError[400]);
    });
    test('Message body is empty', () => {
      expect(() => requestPlayerChatSend(player.playerId, '')).toThrow(HTTPError[400]);
    });
    test('Message body is longer than 100 characters', () => {
      const longMessage = validMessage.repeat(20);
      expect(() => requestPlayerChatSend(player.playerId, longMessage)).toThrow(HTTPError[400]);
    });
  });
});
