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
  requestSessionStateUpdate,
  requestQuizInfoV2,
  requestPlayerSessionResults,
} from './wrapper';

import {
  Question
} from '../dataStore';

import {
  sleepSync
} from '../helper';

import HTTPError from 'http-errors';

  interface QuizId { quizId: number }
  interface TokenObject { token: string }
  interface SessionObject { sessionId: number }
  interface PlayerObject { playerId: number }

// Valid constants
const VALID_NAME = 'Tom Boy';
const VALID_NAME_TWO = 'Boy Tom';

let user: TokenObject;
let quiz: QuizId;
let sessionId: SessionObject;
let player: PlayerObject;
let playerTwo: PlayerObject;
let answerId: number;
let correctId: number;
let correctIdTwo: number;

beforeEach(() => {
  requestClear();
  user = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
  quiz = requestQuizCreateV2(user.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
  requestQuizQuestionCreateV2(user.token, quiz.quizId, VALID_Q_BODY);
  requestQuizQuestionCreateV2(user.token, quiz.quizId, VALID_Q_BODY_2);
  const question: Question = requestQuizInfoV2(user.token, quiz.quizId).questions[0];
  const questionTwo: Question = requestQuizInfoV2(user.token, quiz.quizId).questions[1];
  sessionId = requestQuizSessionStart(user.token, quiz.quizId, 1); // status - ACTIVE
  player = requestPlayerJoin(sessionId.sessionId, VALID_NAME);
  playerTwo = requestPlayerJoin(sessionId.sessionId, VALID_NAME_TWO);
  answerId = requestQuizInfoV2(user.token, quiz.quizId).questions[0].answers[0].answerId;
  correctId = question.answers.find(answer => answer.correct === true).answerId;
  correctIdTwo = questionTwo.answers.find(answer => answer.correct === true).answerId;
  requestSessionStateUpdate(user.token, quiz.quizId, sessionId.sessionId, sessionAction.NEXT_QUESTION);
  requestSessionStateUpdate(user.token, quiz.quizId, sessionId.sessionId, sessionAction.SKIP_COUNTDOWN);
  requestSubmitAnswer(player.playerId, 1, [correctId]);
  requestSubmitAnswer(playerTwo.playerId, 1, [answerId]);
  sleepSync(VALID_Q_BODY.duration * 1000);
  requestSessionStateUpdate(user.token, quiz.quizId, sessionId.sessionId, sessionAction.NEXT_QUESTION);
  requestSessionStateUpdate(user.token, quiz.quizId, sessionId.sessionId, sessionAction.SKIP_COUNTDOWN);
  requestSubmitAnswer(player.playerId, 2, [correctIdTwo]);
  requestSubmitAnswer(playerTwo.playerId, 2, [correctIdTwo]);
  sleepSync(VALID_Q_BODY_2.duration * 1000);
  requestSessionStateUpdate(user.token, quiz.quizId, sessionId.sessionId, sessionAction.GO_TO_FINAL_RESULTS);
});

afterEach(() => {
  requestClear();
});

describe('Tests for playerSessionResults', () => {
  describe('Success Case', () => {
    test('Correct Output', () => {
      expect(requestPlayerSessionResults(player.playerId)).toStrictEqual({
        usersRankedByScore: [
          {
            name: VALID_NAME,
            score: expect.any(Number)
          },
          {
            name: VALID_NAME_TWO,
            score: expect.any(Number)
          }
        ],
        questionResults: [
          {
            questionId: expect.any(Number),
            playersCorrectList: [
              VALID_NAME
            ],
            averageAnswerTime: expect.any(Number),
            percentCorrect: 50
          },
          {
            questionId: expect.any(Number),
            playersCorrectList: [
              VALID_NAME,
              VALID_NAME_TWO
            ],
            averageAnswerTime: expect.any(Number),
            percentCorrect: 100
          }
        ]
      });
    });
  });
  describe('Error Cases', () => {
    test('Player ID does not exist', () => {
      expect(() => requestPlayerSessionResults(player.playerId + 1)).toThrow(HTTPError[400]);
    });
    test('Session is not in FINAL_RESULTS state', () => {
      requestSessionStateUpdate(user.token, quiz.quizId, sessionId.sessionId, sessionAction.END);
      expect(() => requestPlayerSessionResults(player.playerId)).toThrow(HTTPError[400]);
    });
  });
});
