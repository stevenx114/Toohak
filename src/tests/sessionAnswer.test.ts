import { Question } from '../dataStore';
import { PlayerIdReturn, QuizIdReturn, SessionIdReturn, TokenReturn, VALID_Q_BODY, VALID_Q_BODY_2, sessionAction, validDetails } from '../types';
import { requestAuthRegister, requestClear, requestPlayerJoin, requestQuizCreate, requestQuizInfoV2, requestQuizQuestionCreate, requestQuizSessionStart, requestSessionStateUpdate, requestSubmitAnswer } from './wrapper';
import HTTPError from 'http-errors';

afterEach(() => {
  requestClear();
});

describe('statusView test', () => {
  let token: TokenReturn;
  let sessionId: SessionIdReturn;
  let quizId: QuizIdReturn;
  let playerId: PlayerIdReturn;
  let answerId: number;
  let correctId: number;
  beforeEach(() => {
    requestClear();
    token = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    quizId = requestQuizCreate(token.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
    requestQuizQuestionCreate(token.token, quizId.quizId, VALID_Q_BODY);
    requestQuizQuestionCreate(token.token, quizId.quizId, VALID_Q_BODY_2);
    sessionId = requestQuizSessionStart(token.token, quizId.quizId, 3);
    playerId = requestPlayerJoin(sessionId.sessionId, validDetails.FIRST_NAME);
    requestSessionStateUpdate(token.token, quizId.quizId, sessionId.sessionId, sessionAction.NEXT_QUESTION);
    requestSessionStateUpdate(token.token, quizId.quizId, sessionId.sessionId, sessionAction.SKIP_COUNTDOWN);
    answerId = requestQuizInfoV2(token.token, quizId.quizId).questions[0].answers[0].answerId;
    const question: Question = requestQuizInfoV2(token.token, quizId.quizId).questions[0];
    correctId = question.answers.find(answer => answer.correct === true).answerId;
  });

  describe('Valid Input test', () => {
    test('All inputs are valid with correct answer', () => {
      expect(requestSubmitAnswer(playerId.playerId, 1, [correctId])).toStrictEqual({});
    });

    test('All inputs are valid with incorrect answer', () => {
      expect(requestSubmitAnswer(playerId.playerId, 1, [answerId])).toStrictEqual({});
    });

    test('Incorrect then correct', () => {
      expect(requestSubmitAnswer(playerId.playerId, 1, [answerId, correctId])).toStrictEqual({});
    });
  });

  describe('Invalid Input Tests', () => {
    test('Session is not in QUESTION_OPEN state', () => {
      requestSessionStateUpdate(token.token, quizId.quizId, sessionId.sessionId, sessionAction.END);
      expect(() => requestSubmitAnswer(playerId.playerId, 1, [correctId])).toThrow(HTTPError[400]);
    });

    test('If player ID does not exist', () => {
      expect(() => requestSubmitAnswer(playerId.playerId + 1, 1, [correctId])).toThrow(HTTPError[400]);
    });

    test('If question position is not valid for the session this player is in && If session is not yet up to this question ', () => {
      expect(() => requestSubmitAnswer(playerId.playerId, 99, [answerId])).toThrow(HTTPError[400]);
    });

    test('Answer IDs are not valid for this particular question', () => {
      expect(() => requestSubmitAnswer(playerId.playerId, 1, [-412312])).toThrow(HTTPError[400]);
    });

    test('There are duplicate answerIds provided', () => {
      expect(() => requestSubmitAnswer(playerId.playerId, 1, [answerId, answerId])).toThrow(HTTPError[400]);
    });

    test('Less than 1 answerId was submitted', () => {
      expect(() => requestSubmitAnswer(playerId.playerId, 1, [])).toThrow(HTTPError[400]);
    });
  });
});
