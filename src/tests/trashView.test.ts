import { requestAuthRegister, requestClear, requestQuizCreate, requestTrashView, requestQuizRemove } from './wrapper';
import { validDetails, TokenReturn, QuizIdReturn } from '../types';
const ERROR = expect.any(String);

describe('tests for view Trash', () => {
  let token: TokenReturn;
  let quizId: QuizIdReturn;

  beforeEach(() => {
    requestClear();
    token = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    quizId = requestQuizCreate(token.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
  });

  // Error cases
  test('Invalid token', () => {
    const res = requestTrashView(token.token + 'a');
    expect(res.statusCode).toBe(401);
    expect(res.error).toStrictEqual(ERROR);
  });

  // Success cases
  test('Doesnt own a trashed Quiz', () => {
    const res = requestTrashView(token.token);
    expect(res).toStrictEqual({ quizzes: [] });
  });

  test('Owns a trashed Quiz', () => {
    requestQuizRemove(token.token, quizId.quizId);
    const res = requestTrashView(token.token);

    const expectedResult = {
      quizzes: [{
        quizId: quizId.quizId,
        name: validDetails.QUIZ_NAME,
      }]
    };

    expect(res).toStrictEqual(expectedResult);
  });
});
