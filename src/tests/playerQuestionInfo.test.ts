import {
  validDetails,
  TokenReturn,
  ErrorObject,
  QuizIdReturn,
} from '../types';

import {
  requestAuthRegister,
  requestQuizCreate,
  requestClear,
  requestQuizSessionView,
  requestLogout,
  requestQuizQuestionCreate
} from './wrapper';  

import HTTPError from 'http-errors';

interface QuizId { quizId: number };
interface TokenObject { token: string };
interface SessionObject { sessionId: number };
interface PlayerObject { playerId: number };

const ERROR = expect.any(String);
const NUMBER = expect.any(Number);
const COLOUR = expect.any(String);

// Valid constants
const VALID_NAME = 'Max Lee';
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
  thumbnailURL: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png'
};
const VALID_QUESTION_BODY_2: QuestionBody = {
  question: 'question_2',
  duration: 6,
  points: 4,
  answers: [
    {
      answer: 'nice',
      correct: true
    },
    {
      answer: 'hi',
      correct: true
    }
  ],
  thumbnailURL: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png'
};

// Tests for playerQuestionInfo
describe('GET playerQuestionInfo', () => {
  // Error cases
  let user: TokenObject;
  let quiz: QuizId;
  let player: playerObject;
  let session: SessionObject;
  beforeEach(() => {
    requestClear();
    user = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    quiz = requestQuizCreate(user.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
    requestCreateQuestionV2(user.token, quiz.quizId, VALID_QUESTION_BODY);
    requestCreateQuestionV2(user.token, quiz.quizId, VALID_QUESTION_BODY_2);
    session = requestSessionStart(user.token, quiz.quizId, 4);
    player = requestPlayerJoin(session.sessionId, VALID_NAME);
  });

  test('Player ID does not exist', () => {
    expect(() => requestplayerQuestionInfo(player.playerId + 1, 1).toThrow(HTTPError[400]));
  });

  test('Session is in END or LOBBY state', () => {
    expect(() => requestplayerQuestionInfo(player.playerId, 1).toThrow(HTTPError[400]));
    requestSessionStateUpdate(user.token, quizId.quizId, sessionId.sessionId, 'END');
    expect(() => requestplayerQuestionInfo(player.playerId, 1).toThrow(HTTPError[400]));
  });

  test('Session is not currently on this question', () => {
    requestSessionStateUpdate(user.token, quizId.quizId, sessionId.sessionId, 'NEXT_QUESTION');
    sleepSync(1 * 100);
    expect(() => requestplayerQuestionInfo(player.playerId, 2).toThrow(HTTPError[400]));
  });

  test('QuestionPosition is invalid', () => {
    expect(() => requestplayerQuestionInfo(player.playerId, 1000).toThrow(HTTPError[400]));
  });

  // Success Case
  test('Correct output', () => {
    expect(requestplayerQuestionInfo(player.playerId, 1)).toStrictEqual({
      questionId: expect.any(Number),
      question: 'question',
      duration: 3,
      thumbnailURL: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png',
      points: 3,
      answers: [
        {
          answerId: NUMBER,
          answer: 'answer1',
          colour: COLOUR
        },
        {
          answerId: NUMBER,
          answer: 'answer2',
          colour: COLOUR
        }
      ]
    })
  });

});
