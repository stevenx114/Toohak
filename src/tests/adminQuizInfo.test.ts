import {
    validDetails,
    QuizIdReturn,
    TokenReturn,
    ErrorObject
  } from '../types';
  
  import {
    requestAuthRegister,
    requestQuizInfo,
    requestClear,
  } from './wrapper';
  
  import {
    Quiz,
  } from '../dataStore';
  
  const ERROR = expect.any(String);
  
  beforeEach(() => {
    requestClear();
  });

// Tests for adminQuizInfo function
describe('GET /v1/admin/quiz/{quizid}', () => {
    let ownsQuizUserToken: TokenReturn;
    let noQuizUserToken: TokenReturn;
    let quizId: QuizIdReturn;
    beforeEach(() => {
      ownsQuizUserToken = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
      noQuizUserToken = requestAuthRegister(validDetails.EMAIL_2, validDetails.PASSWORD_2, validDetails.FIRST_NAME_2, validDetails.LAST_NAME_2);
    //   quizId = requestQuizCreate(ownsQuizUserToken.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
    });
  
    // Success cases for adminQuizInfo function
    describe.skip('Success Cases', () => {
      test('Correct details', () => {
        expect(requestQuizInfo(ownsQuizUserToken.token, quizId.quizId)).toStrictEqual({
          quizId: quizId.quizId,
          name: validDetails.QUIZ_NAME,
          timeCreated: expect.any(Number),
          timeLastEdited: expect.any(Number),
          description: validDetails.DESCRIPTION,
          numQuestions: expect.any(Number),
          questions: expect.any(Array),
        });
      });
    });
  
    // Error cases for adminQuizInfo function
    describe.skip('Error cases', () => {
      let errorResult: ErrorObject;
      test('Token is empty', () => {
        errorResult = requestQuizInfo('', quizId.quizId);
        expect(errorResult.error).toStrictEqual(ERROR);
        expect(errorResult.statusCode).toStrictEqual(401);
      });
  
      test('Token is invalid', () => {
        errorResult = requestQuizInfo(ownsQuizUserToken.token + 1, quizId.quizId);
        expect(errorResult.error).toStrictEqual(ERROR);
        expect(errorResult.statusCode).toStrictEqual(401);
      });
  
      test('Quiz ID does not refer to a quiz that this user owns', () => {
        errorResult = requestQuizInfo(noQuizUserToken.token, quizId.quizId);
        expect(errorResult.error).toStrictEqual(ERROR);
        expect(errorResult.statusCode).toStrictEqual(403);
      });
    });
  });