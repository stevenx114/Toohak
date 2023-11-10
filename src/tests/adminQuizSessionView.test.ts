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

interface QuizId { quizId: number };
interface TokenObject { token: string };
const ERROR = expect.any(String);

beforeEach(() => {
    requestClear();
});

// Tests for adminQuizSessionView
describe('GET adminQuizSessionView', () => {
  let user: TokenObject;
  let quiz: QuizId;
  beforeEach(() => {
    requestClear();
    user = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    quiz = requestQuizCreate(userToken, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
  });

  // Error Cases
  test('Token is empty', () => {
    expect(() => requestQuizSessionView(quiz.quizId, '')).toThrow(HTTPError[401]);
  });

  test('Valid token but not for logged in user', () => {
    const user1: TokenObject = requestAuthRegister(validDetails.EMAIL_2, validDetails.PASSWORD_2, validDetails.FIRST_NAME_2, validDetails.LAST_NAME_2);
    requestLogout(user1.token);
    expect(() => requestQuizSessionView(quiz.quizId, user1.token).toThrow(HTTPError[401]));
  });

  test('Valid token but not the correct quiz owner', () => {
    const user1: TokenObject = requestAuthRegister(validDetails.EMAIL_2, validDetails.PASSWORD_2, validDetails.FIRST_NAME_2, validDetails.LAST_NAME_2);
    // Try to add question into another quiz from the second user.
    expect(() => requestQuizSessionView(quiz.quizId, user1.token).toThrow(HTTPError[403]));
  });

  // Success cases
  test('')
}); 