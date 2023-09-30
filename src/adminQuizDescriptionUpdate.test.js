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
  
  beforeEach(() => {
    clear();
  });
   
  describe('adminQuizDescriptionUpdate Input Tests', () => {

    describe('Empty Data Store Test', () => {

        test('authUserId and QuizId is invalid', () => {

            // First Create Two Users User

            const email = 'sample@gmail.com';
            const password = 'samplepassword1';
            const nameFirst = 'firstname';
            const nameLast = 'lastname';
            const authUserId = adminAuthRegister(email, password, nameFirst, nameLast);
            
            // Create Quiz

            const quizName = "randomquiz";
            const newDescription = "random";
            const quizId = 44;

            
            expect(adminQuizDescriptionUpdate(authUserId, quizId, newDescription)).toStrictEqual(ERROR);

        });



    });

    describe('Invalid Input tests', () => {

        test('authUserId is invalid but all other variables are correct', () => {

            // First Create User

            const email = 'sample@gmail.com';
            const password = 'samplepassword1';
            const nameFirst = 'firstname';
            const nameLast = 'lastname';
            const authUserId = adminAuthRegister(email, password, nameFirst, nameLast);
            
            // Create Quiz

            const quizName = "randomquiz";
            const newDescription = "random";
            const quizId = adminQuizCreate(authUserId, quizName, "");
            
            // Making authUserId invalid

            authUserId += 4;

            
            expect(adminQuizDescriptionUpdate(authUserId, quizId, newDescription)).toStrictEqual(ERROR);
            
        });


        test('Invalid quizId but all other variables correct', () => {

            // First Create User

            const email = 'sample@gmail.com';
            const password = 'samplepassword1';
            const nameFirst = 'firstname';
            const nameLast = 'lastname';
            const authUserId = adminAuthRegister(email, password, nameFirst, nameLast);
            
            // Create Quiz

            const quizName = "randomquiz";
            const newDescription = "random";
            const quizId = adminQuizCreate(authUserId, quizName, "");
            
            // Making quizId invalid

            quizId += 4;

            
            expect(adminQuizDescriptionUpdate(authUserId, quizId, newDescription)).toStrictEqual(ERROR);


        });

        test('given user inputs quizId they dont own but all other variables correct', () => {

            // First Two Users

            const email = 'sample@gmail.com';
            const password = 'samplepassword1';
            const nameFirst = 'firstname';
            const nameLast = 'lastname';
            const authUserId = adminAuthRegister(email, password, nameFirst, nameLast);
            const authUserId2 = adminAuthRegister("testing@gmail.com", "badpassword44", "Testing", "testing");

            // Create Quiz with second user

            const quizName = "randomquiz";
            const newDescription = "newdescription";
            const quizId = adminQuizCreate(authUserId2, quizName, "");
            

            // Tries to update quiz user doesnt own 
            
            expect(adminQuizDescriptionUpdate(authUserId, quizId, newDescription)).toStrictEqual(ERROR);

        });


        test('Invalid Description i.e description.length > 100 characters but all other variables correct', () => {

            
            // First Create User

            const email = 'sample@gmail.com';
            const password = 'samplepassword1';
            const nameFirst = 'firstname';
            const nameLast = 'lastname';
            const authUserId = adminAuthRegister(email, password, nameFirst, nameLast);
            
            // Create Quiz

            const quizName = "randomquiz";
            const longDescription = "a".repeat(105);
            const quizId = adminQuizCreate(authUserId, quizName, "");


            // Update Quizes Description with invalid description
            
            expect(adminQuizDescriptionUpdate(authUserId, quizId, longDescription)).toStrictEqual(ERROR);

        });

    });


    describe('Valid Input test', () => {

        test('All inputs are valid', () => {

            // First Create User

            const email = 'sample@gmail.com';
            const password = 'samplepassword1';
            const nameFirst = 'firstname';
            const nameLast = 'lastname';
            const authUserId = adminAuthRegister(email, password, nameFirst, nameLast);
            
            // Create Quiz

            const quizName = "randomquiz";
            const newDescription = "newdescription";
            const quizId = adminQuizCreate(authUserId, quizName, "");


            // Update Quizes Description
            
            expect(adminQuizDescriptionUpdate(authUserId, quizId, newDescription)).toStrictEqual({});

        });

        test('All inputs are valid but description is empty string', () => {

            // First Create User

            const email = 'sample@gmail.com';
            const password = 'samplepassword1';
            const nameFirst = 'firstname';
            const nameLast = 'lastname';
            const authUserId = adminAuthRegister(email, password, nameFirst, nameLast);
            
            // Create Quiz

            const quizName = "randomquiz";
            const newDescription = "";
            const quizId = adminQuizCreate(authUserId, quizName, "olddescription");


            // Update Quizes Description
            
            expect(adminQuizDescriptionUpdate(authUserId, quizId, newDescription)).toStrictEqual({});

        });

    });


  });
  
