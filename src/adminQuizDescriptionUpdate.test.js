import {
  clear,
} from './other';

import {
  adminAuthRegister,
  adminQuizCreate,
  adminQuizDescriptionUpdate
} from './auth';
  
const ERROR = { error: expect.any(String) };

let authUserId;
let quizId;

beforeEach(() => {
  clear();
  authUserId = adminAuthRegister('sample@gmail.com', 'samplepassword1', 'firstname', 'lastname');
  quizId = adminQuizCreate(authUserId.authUserId, "quizName", "sample");
});
   
describe('adminQuizDescriptionUpdate Test', () => {

  describe('Empty Data Store Test', () => {

    test('authUserId and QuizId is invalid', () => {

      clear();

      expect(adminQuizDescriptionUpdate(authUserId.authUserId, quizId.quizId, newDescription)).toStrictEqual(ERROR);

    });

  });

  describe('Invalid Input Tests', () => {

    test('authUserId is invalid but all other variables are correct', () => {
        
      expect(adminQuizDescriptionUpdate(authUserId.authUserId + 1, quizId.quizId, "")).toStrictEqual(ERROR);
        
    });


    test('Invalid quizId but all other variables correct', () => {
        
      expect(adminQuizDescriptionUpdate(authUserId.authUserId, quizId.quizId + 1, "")).toStrictEqual(ERROR);

    });

    test('given user inputs quizId they dont own but all other variables correct', () => {

      const authUserId2 = adminAuthRegister("testing@gmail.com", "badpassword44", "Testing", "testing");

      const quizId2 = adminQuizCreate(authUserId2.authUserId, "randomquiz", "");
        
      expect(adminQuizDescriptionUpdate(authUserId.authUserId, quizId2.quizId, "")).toStrictEqual(ERROR);

    });


    test('Invalid Description i.e description.length > 100 characters but all other variables correct', () => {

      const longDescription = "a".repeat(105);
        
      expect(adminQuizDescriptionUpdate(authUserId.authUserId, quizId.quizId, longDescription)).toStrictEqual(ERROR);

    });

  });

  describe('Valid Input test', () => {

    test('All inputs are valid', () => {

      expect(adminQuizDescriptionUpdate(authUserId.authUserId, quizId.quizId, "newDescription")).toStrictEqual({});

    });

    test('All inputs are valid but description is empty string', () => {
        
      expect(adminQuizDescriptionUpdate(authUserId, quizId, "")).toStrictEqual({});

    });

  });

});

