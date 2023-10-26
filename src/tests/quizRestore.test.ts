import { QuizIdReturn, validDetails } from "../types";
import { requestAuthRegister, requestClear, requestQuizCreate, requestQuizRemove, requestQuizRestore } from "./wrapper";
import { Token } from "../dataStore";

const ERROR = {error: expect.any(String)};

describe('quizRestore test', () => {
    let token: Token;
    let quizId: QuizIdReturn;
    beforeEach(() => {  
        requestClear();
        token = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME).body;
        quizId = requestQuizCreate(token.sessionId, validDetails.QUIZ_NAME, validDetails.DESCRIPTION).body;
    });
  
    describe('Invalid Input Tests', () => {
      test('Quiz name of the restored quiz is already used by another active quiz', () => {
        requestQuizRemove(token.sessionId, quizId.quizId);
        requestQuizCreate(token.sessionId, validDetails.QUIZ_NAME, validDetails.DESCRIPTION).body;

        const res = requestQuizRestore(quizId.quizId, token.sessionId);
        expect(res.statusCode).toBe(400);
        expect(res.body).toStrictEqual(ERROR);
      });
  
      test('Quiz ID refers to a quiz that is not currently in the trash', () => {
        const res = requestQuizRestore(quizId.quizId, token.sessionId);
        expect(res.statusCode).toBe(400);
        expect(res.body).toStrictEqual(ERROR);
      });
  
      test('Token is empty', () => {
        requestQuizRemove(token.sessionId, quizId.quizId);

        const res = requestQuizRestore(quizId.quizId, '');
        expect(res.statusCode).toBe(401);
        expect(res.body).toStrictEqual(ERROR);
      });

      test('Token is invalid and does not refer to a valid loggin in user', () => {
        requestQuizRemove(token.sessionId, quizId.quizId);

        const res = requestQuizRestore(quizId.quizId, token.sessionId + '0.1');
        expect(res.statusCode).toBe(401);
        expect(res.body).toStrictEqual(ERROR);
      });
  
      test('Valid token is provided, but user is not an owner of this quiz', () => {
        requestQuizRemove(token.sessionId, quizId.quizId);
        const token2 = requestAuthRegister('a' + validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME).body;

        const res = requestQuizRestore(quizId.quizId, token2.sessionId);
        expect(res.statusCode).toBe(403);
        expect(res.body).toStrictEqual(ERROR);
      });
    });
  
    describe('Valid Input test', () => {
      test('All inputs are valid', () => {
        requestQuizRemove(token.sessionId, quizId.quizId);
        
        const res = requestQuizRestore(quizId.quizId, token.sessionId);
        expect(res.statusCode).toBe(200);
        expect(res.body).toStrictEqual({});
      });
    });
  });
  