import {
    adminQuizNameUpdate, 
    adminQuizCreate,
    adminQuizInfo
} from './quiz';

import {
    adminAuthRegister
} from './auth';

import {
    clear
} from './other';

const ERROR = { error: expect.any(String) };

// Tests for adminQuizNameUpdate function
describe('adminQuizNameUpdate', () => {
    let newUser;
    let newQuiz;
    beforeEach(() => {
        clear();
        newUser = adminAuthRegister('johnsmith@gmail.com', 'ilovedog123', 'John', 'Smith');
        newQuiz = adminQuizCreate(newUser.authUserId, 'nameNew', 'descriptionNew');
    });

    // Success cases for adminQuizNameUpdate function
    describe('Success Cases', () => {
        test('Successful implementation', () => {        
            expect(adminQuizNameUpdate(newUser.authUserId, newQuiz.quizId, 'nameUpdated')).toEqual({});
            const curQuiz = adminQuizInfo(newUser.authUserId, newQuiz.quizId);
            expect(curQuiz.name).toEqual('nameUpdated');
        });
    });

    // Error cases for adminQuizNameUpdate function
    describe('Error cases', () => {
        test('AuthUserId is not a valid user', () => {
            clear();
            expect(adminQuizNameUpdate(newUser.authUserId, newQuiz.quizId, 'nameUpdated')).toEqual(ERROR); 
        });

        test('Quiz ID does not refer to a valid quiz', () => {
            clear();
            newUser = adminAuthRegister('johnsmith@gmail.com', 'ilovedog123', 'John', 'Smith');
            expect(adminQuizNameUpdate(newUser.authUserId, newQuiz.quizId, 'nameUpdated')).toEqual(ERROR);
        });

        test('Quiz ID does not refer to a quiz that this user owns', () => {
            const noQuizzesUser = adminAuthRegister('george@gmail.com', 'ilovedog123', 'George', 'Smith');
            expect(adminQuizNameUpdate(noQuizzesUser.authUserId, newQuiz.quizId, 'nameUpdated')).toEqual(ERROR);
        });

        test('Name contains invalid characters. Valid characters are alphanumeric and spaces', () => {
            expect(adminQuizNameUpdate(newUser.authUserId, newQuiz.quizId, 'name Updated!')).toEqual(ERROR); 
        });

        test('Name is less than 3 characters long', () => {
            expect(adminQuizNameUpdate(newUser.authUserId, newQuiz.quizId, 'na')).toEqual(ERROR); 
        });

        test('Name is more than 30 characters long', () => {
            expect(adminQuizNameUpdate(newUser.authUserId, newQuiz.quizId, 'nameUpdatednameUpdatednameUpdated')).toEqual(ERROR); 
        });

        test('Name is already used by the current logged in user for another quiz', () => {
            adminQuizCreate(newUser.authUserId, 'nameOther', 'descriptionNew');
            expect(adminQuizNameUpdate(newUser.authUserId, newQuiz.quizId, 'nameOther')).toEqual(ERROR);
        });
    });
}); 