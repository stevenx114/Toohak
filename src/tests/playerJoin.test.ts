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
const NUMBER = expect.any(Number);

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
  thumbnailURL: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png'
};

const TEST_VALID_NAME1 = 'ALLCAPS';
const TEST_VALID_NAME2 = 'name with space';
const TEST_VALID_NAME3 = 'namewithnumber123';

// Tests for playerJoin function
describe('POST v1/player/join', () => {
  let user: TokenObject;
  let quiz: QuizId;
  beforeEach(() => {
    requestClear();
    user = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    quiz = requestQuizCreate(user.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
    requestCreateQuestionV2(user.token, quiz.quizId, VALID_QUESTION_BODY);
    const sessionId: SessionObject = requestSessionStart(user.token, quiz.quizId, 1); // status - ACTIVE
  });

  // Error Cases
  test('Session is not in LOBBY state', () => {
    requestSessionStateUpdate(user.token, quizId.quizId, sessionId.sessionId, 'END');// status - END
    expect(() => requestPlayerJoin(sessionId.sessionId, 'harry mcClary').toThrow(HTTPError[400]));
  });

  test('Name is not unique', () => {  
    requestPlayerJoin(sessionId.sessionId, VALID_NAME);
    expect(() => requestPlayerJoin(sessionId.sessionId, VALID_NAME).toThrow(HTTPError[400]));
  });

  // Success Cases
  test.each([
    [ 'name with number', 'Max123' ],
    [ 'name with spaces', 'Max Lee' ],
    [ 'name in CAPS', 'MAXLEE' ],
    [ 'name is empty', '' ],
  ]) ('%s', (test, name) => {
    if (name === '') {
      expect(requestPlayerJoin(sessionId.sessionId, name)).toStrictEqual({ playerId: NAME });
    }
    expect(requestPlayerJoin(sessionId.sessionId, name)).toStrictEqual({ playerId: NUMBER });
  });
  
});