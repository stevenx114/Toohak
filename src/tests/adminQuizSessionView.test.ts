import {
    validDetails,
    TokenReturn,
    ErrorObject
  } from '../types';
  
  import {
    requestAuthRegister,
    requestQuizCreate,
    requestClear,
    requestQuizSessionView,
    requestLogout,
    requestQuizQuestionCreate
  } from './wrapper';  

const ERROR = expect.any(String);

beforeEach(() => {
    requestClear();
});

// Tests for adminQuizSessionView
describe('GET adminQuizSessionView', () => {
  let userToken: TokenReturn;
  let errorResult: ErrorObject;
  beforeEach(() => {
    userToken = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    requestQuizCreate(userToken.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
    quizCreateReturn = requestQuizCreate(user1.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
    quiz1 = quizCreateReturn as QuizIdReturn;
  });

  // Error Cases
  test('Token is empty', () => {
    errorResult = requestQuizSessionView(userToken.token, '');
    expect(errorResult.error).toStrictEqual(ERROR);
    expect(errorResult.statusCode).toStrictEqual(401);
  });

  test('Valid token but not for logged in user', () => {
    const user2 = requestAuthRegister(validDetails.EMAIL_2, validDetails.PASSWORD_2, validDetails.FIRST_NAME_2, validDetails.LAST_NAME_2);
    const token2 = user2 as TokenReturn;
    requestLogout(token2.token);

    const errorResult = requestQuizSessionView(token2.token, quiz1.quizId);
    expect(errorResult.error).toStrictEqual(ERROR);
    expect(errorResult.statusCode).toStrictEqual(403);
  });

  // Success cases
  test('')
});