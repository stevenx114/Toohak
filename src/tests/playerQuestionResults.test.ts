import {
  validDetails,
  VALID_Q_BODY_2,
  sessionAction,
  VALID_Q_BODY
} from '../types';

import {
  requestAuthRegister,
  requestQuizCreateV2,
  requestClear,
  requestPlayerJoin,
  requestQuizSessionStart,
  requestQuizQuestionCreateV2,
  requestSubmitAnswer,
  requestPlayerQuestionResults,
  requestSessionStateUpdate,
  requestQuizInfoV2
} from './wrapper';

import {
  Question
} from '../dataStore';

import HTTPError from 'http-errors';

interface QuizId { quizId: number }
interface TokenObject { token: string }
interface SessionObject { sessionId: number }
interface PlayerObject { playerId: number }

// Valid constants
const VALID_NAME = 'Tom Boy';

let user: TokenObject;
let quiz: QuizId;
let sessionId: SessionObject;
let player: PlayerObject;
let playerTwo: PlayerObject;
let answerId: number;
let correctId: number;

beforeEach(() => {
  requestClear();
  user = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
  quiz = requestQuizCreateV2(user.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
  requestQuizQuestionCreateV2(user.token, quiz.quizId, VALID_Q_BODY);
  requestQuizQuestionCreateV2(user.token, quiz.quizId, VALID_Q_BODY_2);
  const question: Question = requestQuizInfoV2(user.token, quiz.quizId).questions[0];
  sessionId = requestQuizSessionStart(user.token, quiz.quizId, 1); // status - ACTIVE
  player = requestPlayerJoin(sessionId.sessionId, VALID_NAME);
  playerTwo = requestPlayerJoin(sessionId.sessionId, 'Steven Xu');
  answerId = requestQuizInfoV2(user.token, quiz.quizId).questions[0].answers[0].answerId;
  correctId = question.answers.find(answer => answer.correct === true).answerId;
  requestSessionStateUpdate(user.token, quiz.quizId, sessionId.sessionId, sessionAction.NEXT_QUESTION);
  requestSessionStateUpdate(user.token, quiz.quizId, sessionId.sessionId, sessionAction.SKIP_COUNTDOWN);
  requestSubmitAnswer(player.playerId, 1, [correctId]);
  requestSubmitAnswer(playerTwo.playerId, 1, [answerId]);
  requestSessionStateUpdate(user.token, quiz.quizId, sessionId.sessionId, sessionAction.GO_TO_ANSWER);
});

afterEach(() => {
  requestClear();
});

describe('Test cases for playerQuestionResults', () => {
  describe('Success Case', () => {
    test('Correct Output', () => {
      expect(requestPlayerQuestionResults(player.playerId, 1)).toStrictEqual({
        questionId: expect.any(Number),
        playersCorrectList: [VALID_NAME],
        averageAnswerTime: expect.any(Number),
        percentCorrect: 50
      });
    });
  });
  describe('Error Cases', () => {
    test('Player ID does not exist', () => {
      expect(() => requestPlayerQuestionResults(player.playerId + 1, 1)).toThrow(HTTPError[400]);
    });
    test('Question position is not valid for the session this player is in', () => {
      expect(() => requestPlayerQuestionResults(player.playerId, -5)).toThrow(HTTPError[400]);
    });
    test('Session is not yet up to this question', () => {
      expect(() => requestPlayerQuestionResults(player.playerId, 2)).toThrow(HTTPError[400]);
    });
    test('Session is not in ANSWER_SHOW state', () => {
      requestSessionStateUpdate(user.token, quiz.quizId, sessionId.sessionId, sessionAction.END);
      expect(() => requestPlayerQuestionResults(player.playerId, 1)).toThrow(HTTPError[400]);
    });
    test('If session is not yet up to this question', () => {
      expect(() => requestPlayerQuestionResults(player.playerId, 2)).toThrow(HTTPError[400]);
    });
  });
});
