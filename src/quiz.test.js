import {    
    adminAuthRegister, 
    adminQuizInfo,
} from './auth';

import {
    adminQuizCreate,
} from './quiz';

import {
    clear,
} from './other';

const ERROR = { error: expect.any(String) };

beforeEach(() => {
    clear();
});

// Tests for adminQuizInfo function
describe('adminQuizInfo Test', () => {
    let ownsQuizUser;
    let noQuizUser;
    let quiz;

    beforeEach(() => {
        ownsQuizUser = adminAuthRegister('johnsmith@gmail.com', 'ilovecat123', 'John', 'Smith');
        noQuizUser = adminAuthRegister('alina@gmail.com', 'ihatecat123', 'Alina', 'Jie'); 
        quiz = adminQuizCreate(ownsQuizUser.authUserId, 'Cat', 'I love cats'); 
    });

    // Success cases for adminQuizInfo function
    describe('Success Cases', () => {
        test('Correct details', () => {        
            expect(adminQuizInfo(ownsQuizUser.authUserId, quiz.quizId)).toStrictEqual({
                quizId: quiz.quizId, 
                name: 'Cat',
                timeCreated: expect.any(Number),
                timeLastEdited: expect.any(Number),
                description: 'I love cats',
            });
        });
    });

    // Error cases for adminQuizInfo function
    describe('Error cases', () => {
        test('AuthUserId is not a valid user', () => {
            clear();
            expect(adminQuizInfo(ownsQuizUser.authUserId, quiz.quizId)).toStrictEqual(ERROR);
        });

        test('Quiz ID does not refer to a valid quiz', () => {
            clear();
            ownsQuizUser = adminAuthRegister('johnsmith@gmail.com', 'ilovecat123', 'John', 'Smith');
            expect(adminQuizInfo(ownsQuizUser.authUserId, quiz.quizId + 0.1)).toStrictEqual(ERROR);
        });

        test('Quiz ID does not refer to a quiz that this user owns', () => {
            expect(adminQuizInfo(noQuizUser.authUserId, quiz.quizId)).toStrictEqual(ERROR);
        });
    });
}); 

