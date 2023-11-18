import {
  validDetails,
  sessionAction,
  VALID_Q_BODY_2,
  VALID_Q_BODY,
} from '../types';

import {
  requestAuthRegister,
  requestClear,
  requestQuizCreateV2,
  requestQuizSessionStart,
  requestQuizSessionResults,
  requestSessionStateUpdate,
  requestQuizQuestionCreateV2,
  requestPlayerJoin,
  requestSubmitAnswer,
  requestQuizInfoV2
} from './wrapper';
import HTTPError from 'http-errors';

interface QuizId { quizId: number }
interface TokenObject { token: string }
interface SessionObject { sessionId: number }
interface PlayerObject { playerId: number }

beforeEach(() => {
  requestClear();
});

afterEach(() => {
  requestClear();
});

import {
  Question
} from '../dataStore';

import {
  sleepSync
} from '../helper';

describe('GET /v1/admin/quiz/:quizid/session/:sessionid/results', () => {
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

  describe('Success Cases', () => {
    test('Returns correct object', () => {
      expect(requestQuizSessionResults(user.token, quiz.quizId, sessionId.sessionId)).toStrictEqual({
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
    test('Session Id does not refer to a valid session within this quiz', () => {
      expect(() => requestQuizSessionResults(user.token, quiz.quizId, sessionId.sessionId + 1)).toThrow(HTTPError[400]);
    });

    test('Session is not in FINAL_RESULTS state', () => {
      requestSessionStateUpdate(user.token, quiz.quizId, sessionId.sessionId, sessionAction.END);
      expect(() => requestQuizSessionResults(user.token, quiz.quizId, sessionId.sessionId)).toThrow(HTTPError[400]);
    });

    test('Token is empty', () => {
      expect(() => requestQuizSessionResults('', quiz.quizId, sessionId.sessionId)).toThrow(HTTPError[401]);
    });

    test('Token is invalid and does not refer to a valid login in user', () => {
      expect(() => requestQuizSessionResults(user.token + 'a', quiz.quizId, sessionId.sessionId)).toThrow(HTTPError[401]);
    });

    test('Valid token is provided, but user is not an owner of this quiz', () => {
      expect(() => requestQuizSessionResults(user.token, quiz.quizId + 1, sessionId.sessionId)).toThrow(HTTPError[403]);
    });
  });
});
