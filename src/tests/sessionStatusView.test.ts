import { Quiz } from '../dataStore';
import { getQuiz } from '../helper';
import { QuizIdReturn, SessionIdReturn, SessionStatusViewReturn, TokenReturn, VALID_Q_BODY, sessionState, validDetails } from '../types';
import { requestAuthRegister, requestClear, requestQuizCreate, requestQuizInfoV2, requestQuizQuestionCreate, requestQuizSessionStart, requestSessionStatus } from './wrapper';
import HTTPError from 'http-errors';

describe('quizRestore test', () => {
  let token: TokenReturn;
  let quizId: QuizIdReturn;
  let sessionId: SessionIdReturn;
  let quiz: Quiz;
  beforeEach(() => {
    requestClear();
    token = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    quizId = requestQuizCreate(token.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
    requestQuizQuestionCreate(token.token, quizId.quizId, VALID_Q_BODY);
    quiz = requestQuizInfoV2(token.token, quizId.quizId);
    sessionId = requestQuizSessionStart(token.token, quizId.quizId, 3);
  });

  describe('Valid Input test', () => {
    test('All inputs are valid', () => {
      const expectedResult: SessionStatusViewReturn = {
        state: sessionState.LOBBY,
        atQuestion: 0,
        players: [],
        metadata: {
          quizId: quizId.quizId,
          name: quiz.name,
          timeCreated: quiz.timeCreated,
          timeLastEdited: quiz.timeLastEdited,
          description: quiz.description,
          numQuestions: quiz.numQuestions,
          questions: quiz.questions,
          duration: quiz.duration,
          thumbnailUrl: quiz.thumbnailUrl,
        }
      }
      
      expect(requestSessionStatus(token.token, quizId.quizId, sessionId.sessionId)).toStrictEqual(expectedResult);
    });
  });

  describe('Invalid Input Tests', () => {
    test('Session Id does not refer to a valid session within this quiz', () => {
      expect(() => requestSessionStatus(token.token, quizId.quizId, sessionId.sessionId + 1)).toThrow(HTTPError[400]);
    });

    test('Token is empty', () => {
      expect(() => requestSessionStatus('', quizId.quizId, sessionId.sessionId)).toThrow(HTTPError[401]);
    });

    test('Token is invalid and does not refer to a valid loggin in user', () => {
      expect(() => requestSessionStatus(token.token + 'a', quizId.quizId, sessionId.sessionId)).toThrow(HTTPError[401]);
    });

    test('Valid token is provided, but user is not authorised to view this session', () => {
      const token2: TokenReturn = requestAuthRegister('a' + validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
      expect(() => requestSessionStatus(token2.token, quizId.quizId, sessionId.sessionId)).toThrow(HTTPError[403]);
    });
  });
});
