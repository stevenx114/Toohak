import {
    clear,
  } from './other';
  
  import {
    adminAuthRegister,
    adminQuizCreate,
    adminQuizDescriptionUpdate,
    adminQuizInfo
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
  
      test('authUserId is invalid', () => {
          
        expect(adminQuizDescriptionUpdate(authUserId.authUserId + 1, quizId.quizId, "")).toStrictEqual(ERROR);
          
      });
  
  
      test('Invalid quizId', () => {
          
        expect(adminQuizDescriptionUpdate(authUserId.authUserId, quizId.quizId + 1, "")).toStrictEqual(ERROR);
  
      });
  
      test('quizId user doesnt own', () => {
  
        const authUserId2 = adminAuthRegister("testing@gmail.com", "badpassword44", "Testing", "testing");
          
        expect(adminQuizDescriptionUpdate(authUserId2.authUserId, quizId.quizId, "")).toStrictEqual(ERROR);
  
      });
  
  
      test('Invalid Description', () => {
  
        const longDescription = "a".repeat(105);
          
        expect(adminQuizDescriptionUpdate(authUserId.authUserId, quizId.quizId, longDescription)).toStrictEqual(ERROR);
  
      });
  
    });
  
    describe('Valid Input test', () => {
  
      test('All inputs are valid', () => {
  
        expect(adminQuizDescriptionUpdate(authUserId.authUserId, quizId.quizId, "newDescription")).toStrictEqual({});

        expect((adminQuizInfo(authUserId.authUserId, quizId.quizId)).description).toStrictEqual("newDescription");
  
      });
  
      test('All inputs are valid but description is empty string', () => {
          
        expect(adminQuizDescriptionUpdate(authUserId, quizId, "")).toStrictEqual({});

        expect((adminQuizInfo(authUserId.authUserId, quizId.quizId)).description).toStrictEqual("");
  
      });
  
    });
  
  });
  
  