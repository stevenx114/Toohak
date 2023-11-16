import { QuizIdReturn, SessionIdReturn, TokenReturn, VALID_Q_BODY, validDetails } from '../types';
import { requestAuthRegister, requestClear, requestQuizCreate, requestQuizQuestionCreate, requestQuizSessionStart } from './wrapper';
import HTTPError from 'http-errors';

const expectedValidReturn = JSON.parse(`{
    "state": "LOBBY",
    "atQuestion": 3,
    "players": [
      "Hayden"
    ],
    "metadata": {
      "quizId": 5546,
      "name": "This is the name of the quiz",
      "timeCreated": 1683019484,
      "timeLastEdited": 1683019484,
      "description": "This quiz is so we can have a lot of fun",
      "numQuestions": 1,
      "questions": [
        {
          "questionId": 5546,
          "question": "Who is the Monarch of England?",
          "duration": 4,
          "thumbnailUrl": "http://google.com/some/image/path.jpg",
          "points": 5,
          "answers": [
            {
              "answerId": 2384,
              "answer": "Prince Charles",
              "colour": "red",
              "correct": true
            }
          ]
        }
      ],
      "duration": 44,
      "thumbnailUrl": "http://google.com/some/image/path.jpg"
    }
  }`);

describe('quizRestore test', () => {
  let token: TokenReturn;
  let quizId: QuizIdReturn;
  let sessionId: SessionIdReturn;
  beforeEach(() => {
    requestClear();
    token = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    quizId = requestQuizCreate(token.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
    requestQuizQuestionCreate(token.token, quizId.quizId, VALID_Q_BODY);
    sessionId = requestQuizSessionStart(token.token, quizId.quizId, 3);
  });

  describe('Valid Input test', () => {
    test('All inputs are valid', () => {
      // Do something here
      expect(requestQuizSessionResultsCSV(token.token, quizId.quizId, sessionId.sessionId)).toStrictEqual(quizSessionResultsViewCSVReturn);
    });
  });

  describe('Invalid Input Tests', () => {
    test.skip('Session Id does not refer to a valid session within this quiz', () => {
      expect(() => requestQuizSessionResultsCSV(token.token, quizId.quizId, sessionId.sessionId + 1)).toThrow(HTTPError[400]);
    });

    test.skip('Session is not in FINAL_RESULTS state', () => {
      // Change ssesion state to something else other than FINAL_RESULTS
      expect(() => requestQuizSessionResultsCSV(token.token, quizId.quizId, sessionId.sessionId)).toThrow(HTTPError[400]);
    });

    test('Token is empty', () => {
      expect(() => requestQuizSessionResultsCSV('', quizId.quizId, sessionId.sessionId)).toThrow(HTTPError[401]);
    });

    test('Token is invalid and does not refer to a valid loggin in user', () => {
      expect(() => requestQuizSessionResultsCSV(token.token + 'a', quizId.quizId, sessionId.sessionId)).toThrow(HTTPError[401]);
    });

    test('Valid token is provided, but user is not authorised to view this session', () => {
      const token2: TokenReturn = requestAuthRegister('a' + validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
      expect(() => requestQuizSessionResultsCSV(token2.token, quizId.quizId, sessionId.sessionId)).toThrow(HTTPError[403]);
    });
  });
});
