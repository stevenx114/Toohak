import { requestAuthRegister, requestClear, requestQuizCreateV1, requestQuizDescriptionUpdateV1, requestQuizInfo } from "./wrapper";
import { QuizIdReturn, validDetails } from "../types";
import { Quiz, Token } from "../dataStore";

const ERROR = {error: expect.any(String)};


describe('adminQuizDescriptionUpdate Test', () => {
    let token: Token = {
        sessionId: "12312321",
        authUserId: -42,
    };
    let quizId: QuizIdReturn = {
        quizId: -42,
    };
  
    beforeEach(() => {
        requestClear();
        //token = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME).body;
        //quizId = requestQuizCreate(authUserId.authUserId, validDetails.QUIZ_NAME, validDetails.DESCRIPTION).body;
      
    });
  
    describe('Invalid Input Tests', () => {

      test('authUserId is invalid', () => {
        const res = (requestQuizDescriptionUpdateV1(quizId.quizId, token.sessionId + 'a', ''))
        expect(res.statusCode).toBe(400);
        //expect(JSON.parse(res.body as string)).toStrictEqual(ERROR);
      });
  
      test.skip('Invalid quizId', () => {
        expect(requestQuizDescriptionUpdateV1(quizId.quizId + 0.5, token.sessionId, '')).toStrictEqual(ERROR);
      });
  
      test.skip('quizId user doesnt own', () => {
        //const token2 = requestAuthRegister('a' + validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME).body;
        //expect(requestQuizDescriptionUpdateV1(token2.sessionId, quizId.quizId, '')).toStrictEqual(ERROR);
      });
  
      test.skip('Invalid Description', () => {
        //const longDescription = 'a'.repeat(105);
        //expect(requestQuizDescriptionUpdateV1(token.sessionId, quizId.quizId, longDescription)).toStrictEqual(ERROR);
      });
    });
  
    describe('Valid Input test', () => {

      test.skip('Correct Return Value', () => {
        //expect(requestQuizDescriptionUpdateV1(token.sessionId, quizId.quizId, '')).toStrictEqual({});
      });

      test.skip('All inputs are valid', () => {
        //let quizInfo: Quiz;

        //expect(requestQuizDescriptionUpdateV1(token.sessionId, quizId.quizId, validDetails.DESCRIPTION + 'a')).toStrictEqual({});
        //quizInfo = requestQuizInfo(token.sessionId, quizId.quizId).body;
      
        //expect(quizInfo.description).toStrictEqual(validDetails.DESCRIPTION + 'a');
      });
  
      test.skip('All inputs are valid but description is empty string', () => {
        //let quizInfo: Quiz;

        //expect(requestQuizDescriptionUpdateV1(token.sessionId, quizId.quizId, '')).toStrictEqual({});
        //quizInfo = requestQuizInfo(token.sessionId, quizId.quizId).body;
      
        //expect(quizInfo.description).toStrictEqual('');
      });
    });
  });
  
