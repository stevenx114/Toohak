import { requestAuthRegister, requestClear, requestQuizCreate, requestTrashView, requestQuizRemove } from "./wrapper";
import { validDetails, TokenReturn, QuizIdReturn } from "../types";
const ERROR = {error: expect.any(String)};

describe("tests for view Trash", () => {
    let token: TokenReturn;
    let quizId: QuizIdReturn;

    beforeEach(() => {
        requestClear();
        token = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
        quizId = requestQuizCreate(token.sessionId, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
    });
    
    // Error cases
    test("Invalid token", () => {
        const res = requestTrashView(token.sessionId + 'a')
        expect(res).toStrictEqual(ERROR);
    });
    
    // Success cases
    test("Doesnt own a trashed Quiz", () => {
        const res = requestTrashView(token.sessionId)
        expect(res).toStrictEqual({ quizzes: [] });
    });
  
    test("Owns a trashed Quiz", () => {
        requestQuizRemove(quizId.quizId, token.sessionId);
        const res = requestTrashView(token.sessionId);

        const expectedResult = [{
            quizId: quizId.quizId,
            name: validDetails.QUIZ_NAME,
        }]

        expect(res).toStrictEqual(expectedResult);
    });
  
  });