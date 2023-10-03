import {    
    adminAuthRegister, 
    adminUserDetails,
    adminQuizInfo,
} from './auth'

import {
    adminQuizCreate,
} from './quiz';

import {
    clear,
} from './other';

const ERROR = { error: expect.any(String) }

beforeEach(() => {
    clear();
});

// Tests for adminQuizInfo function
describe('adminQuizInfo Test', () => {
    let user;
    let user2;
    let quiz;
    let userDetails;

    beforeEach(() => {
        // User owns quiz
        user = adminAuthRegister('johnsmith@gmail.com', 'ilovecat123', 'John', 'Smith');
        // User2 does not own quiz
        user2 = adminAuthRegister('alina@gmail.com', 'ihatecat123', 'Alina', 'Jie'); 
        quiz = adminQuizCreate(user.userId, 'Cat', 'I love cats'); 
    });

    // Success cases for adminQuizInfo function
    describe('Success Cases', () => {
        test('Correct details', () => {        
            userDetails = adminUserDetails(user.userId);
            expect(adminQuizInfo(user.userId, quiz.quizId)).toStrictEqual({
            quiz: {
                quizId: quiz.quizId, 
                name: 'Cat',
                timeCreated: userDetails.timeCreated,
                timeLastEdited: userDetails.timeLastEdited,
                description: 'I love cats',
            },
            })
        });
    });

    // Error cases for adminQuizInfo function
    describe('Error cases', () => {
        test('AuthUserId is not a valid user', () => {
            expect(adminQuizInfo(user.userId + 0.1, quiz.quizId).toStrictEqual(ERROR));
        });

        test('Quiz ID does not refer to a valid quiz', () => {
            expect(adminQuizInfo(user.userId, quiz.quizId + 0.1).toStrictEqual(ERROR));
        });

        test('Quiz ID does not refer to a quiz that this user owns', () => {
            expect(adminQuizInfo(user2.userId, quiz.quizId).toStrictEqual(ERROR));
        });
    });
}); 

