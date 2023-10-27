import {
  requestClear,
} from './wrapper';

describe('Clear Function implementation', () => {
  // let token: TokenReturn;

  // beforeEach(() => {
  //   token = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
  //   requestQuizCreate(token.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
  // });

  test('Returns empty dictionary', () => {
    expect(requestClear()).toStrictEqual({});
  });

  test.skip('Removing user data', () => {
    // expect(requestClear()).toStrictEqual({});
    // expect(requestUserDetails(token.token).error).toStrictEqual(ERROR);
  });

  test.skip('Removing quiz data', () => {
    // expect(requestClear()).toStrictEqual({});
    // token = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    // expect(requestQuizList(token.token)).toStrictEqual({ quizzes: [] });
  });
});
