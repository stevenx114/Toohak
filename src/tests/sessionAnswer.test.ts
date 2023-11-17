import { PlayerIdReturn, QuizIdReturn, SessionIdReturn, TokenReturn, VALID_Q_BODY, sessionState, validDetails } from '../types';
import { requestAuthRegister, requestClear, requestPlayerJoin, requestQuizCreate, requestQuizQuestionCreate, requestQuizSessionStart, requestSessionStateUpdate, requestSubmitAnswer } from './wrapper';
import HTTPError from 'http-errors';

afterEach(() => {
  requestClear();
});

describe('statusView test', () => {
  let token: TokenReturn;
  let sessionId: SessionIdReturn;
  let quizId: QuizIdReturn;
  let playerId: PlayerIdReturn;

  beforeEach(() => {
    requestClear();
    token = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    quizId = requestQuizCreate(token.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
    requestQuizQuestionCreate(token.token, quizId.quizId, VALID_Q_BODY);
    sessionId = requestQuizSessionStart(token.token, quizId.quizId, 3);
    playerId = requestPlayerJoin(sessionId.sessionId, validDetails.FIRST_NAME)
    requestSessionStateUpdate(token.token, quizId.quizId, sessionId.sessionId, sessionState.QUESTION_OPEN)
  });

  describe('Valid Input test', () => {
    test('All inputs are valid', () => {
      expect(requestSubmitAnswer(playerId.playerId, 1, [1])).toStrictEqual({});
    });
  });

  describe('Invalid Input Tests', () => {
    test('If player ID does not exist', () => {
      expect(() => requestSubmitAnswer(playerId.playerId, 1, [1])).toThrow(HTTPError[400]);
    });

    test('If question position is not valid for the session this player is in && If session is not yet up to this question ', () => {
      expect(() => requestSubmitAnswer(playerId.playerId, 99, [1])).toThrow(HTTPError[400]);
    });

    test('Answer IDs are not valid for this particular question', () => {
      expect(() => requestSubmitAnswer(playerId.playerId, 1, [99])).toThrow(HTTPError[400]);
    });

    test('There are duplicate answerIds provided', () => {
      expect(() => requestSubmitAnswer(playerId.playerId, 1, [1, 1])).toThrow(HTTPError[400]);
    });

    test('Less than 1 answerId was submitted', () => {
      expect(() => requestSubmitAnswer(playerId.playerId, 1, [1, 1])).toThrow(HTTPError[400]);
    });
  });
});
