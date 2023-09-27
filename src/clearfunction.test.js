
import {
    clear,
  } from './other';

  import {
    adminAuthRegister,
    adminAuthLogin,
    adminUserDetails,
    adminQuizList,
    adminQuizCreate,
    adminQuizRemove,
    adminQuizInfo,
    adminQuizNameUpdate,
    adminQuizDescriptionUpdate
  } from './auth';
  
  
  
  const ERROR = { error: expect.any(String) };
  
  
 
  describe('Clear Function implementation', () => {


    test('Registering a User -> clear() function -> then checking if user data is removed using functions', () => {

      // First Create User

      const email = 'sample@gmail.com';
      const password = 'samplepassword1';
      const nameFirst = 'firstname';
      const nameLast = 'lastname';
      const authUserId = adminAuthRegister(email, password, nameFirst, nameLast);

      // Run Clear
      clear();


      // both functions adminAuthLogin and adminUserDetails should return error
      // as user details should be cleared 

      expect(adminUserDetails(authUserId)).toStrictEqual(ERROR);
      expect(adminAuthLogin(email, password)).toStrictEqual(ERROR);

    });
  
    test('Creating a Quiz -> then clearing -> then ensuring quiz still exists using functions', ()=> {
        
      // First Create User who is going to create the quiz and view quiz

      const email = 'sample@gmail.com';
      const password = 'samplepassword1';
      const nameFirst = 'firstname';
      const nameLast = 'lastname';
      const authUserId = adminAuthRegister(email, password, nameFirst, nameLast);

      // Create Quiz

      const quizName = "randomquiz";
      const description = "test";
      const quizId = adminQuizCreate(authUserId, quizName, description);

      // Run Clear
      clear();



      // All these functions viewing the quiz should return error

      expect(adminQuizList(authUserId)).toStrictEqual(ERROR);
      expect(adminQuizRemove(authUserId, quizId)).toStrictEqual(ERROR);
      expect(adminQuizInfo(authUserId, quizId)).toStrictEqual(ERROR);
      expect(adminQuizNameUpdate(authUserId, quizId, "newQuizname")).toStrictEqual(ERROR);
      expect(adminQuizDescriptionUpdate(authUserId, quizId, "newquizdescription")).toStrictEqual(ERROR);


    });


    test('Creating a both a User and a Quiz -> then clearing -> then checking if both user and quiz data is cleared using functions', ()=> {
          
      // First Create User who is going to create the quiz and view quiz

      const email = 'sample@gmail.com';
      const password = 'samplepassword1';
      const nameFirst = 'firstname';
      const nameLast = 'lastname';
      const authUserId = adminAuthRegister(email, password, nameFirst, nameLast);

      // Create Quiz

      const quizName = "randomquiz";
      const description = "test";
      const quizId = adminQuizCreate(authUserId, quizName, description);

      // Run Clear
      clear();


      // both functions adminAuthLogin and adminUserDetails should return error
      // as user details should be cleared 

      expect(adminUserDetails(authUserId)).toStrictEqual(ERROR);
      expect(adminAuthLogin(email, password)).toStrictEqual(ERROR);



      // All these functions viewing the quiz should return error

      expect(adminQuizList(authUserId)).toStrictEqual(ERROR);
      expect(adminQuizRemove(authUserId, quizId)).toStrictEqual(ERROR);
      expect(adminQuizInfo(authUserId, quizId)).toStrictEqual(ERROR);
      expect(adminQuizNameUpdate(authUserId, quizId, "newQuizname")).toStrictEqual(ERROR);
      expect(adminQuizDescriptionUpdate(authUserId, quizId, "newquizdescription")).toStrictEqual(ERROR);


    });


  });
  
 