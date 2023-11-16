import {
    validDetails,
    QuizIdReturn,
    TokenReturn,
  } from '../types';
  
  import {
    requestAuthRegister,
    requestQuizInfoV2,
    requestClear,
    requestQuizCreate
  } from './wrapper';
  
  import HTTPError from 'http-errors';
  
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
      quizId = requestQuizCreate(ownsQuizUserToken.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
    });
  
    // Success cases for adminQuizInfo function
    describe('Success Cases', () => {
      test.skip('Correct details', () => {
        expect(requestQuizInfoV2(ownsQuizUserToken.token, quizId.quizId)).toStrictEqual({
          quizId: quizId.quizId,
          name: validDetails.QUIZ_NAME,
          timeCreated: expect.any(Number),
          timeLastEdited: expect.any(Number),
          description: validDetails.DESCRIPTION,
          numQuestions: expect.any(Number),
          questions: [],
          duration: 0,
          thumbnailUrl: expect.any(String)
        });
      });
    });
  
    // Error cases for adminQuizInfo function
    describe('Error cases', () => {
      test('Token is empty', () => {
        expect(() => requestQuizInfoV2('', quizId.quizId)).toThrow(HTTPError[401]);
      });
      test('Token is invalid', () => {
        expect(() => requestQuizInfoV2(ownsQuizUserToken.token + 1, quizId.quizId)).toThrow(HTTPError[401]);
      });
      test('Quiz ID does not refer to a quiz that this user owns', () => {
        expect(() => requestQuizInfoV2(noQuizUserToken.token, quizId.quizId)).toThrow(HTTPError[403]);
      });
    });
  });
  