import {    
    adminAuthRegister, 
    adminAuthLogin,
} from './auth';

import {
    adminQuizInfo,
    adminQuizCreate,
    adminQuizList,
    adminQuizNameUpdate, 
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

// Tests for AdminQuizCreate function
describe('AdminQuizCreate', () => {
    let userId;
    let quiz;
    beforeEach(() => {
        userId = adminAuthRegister('voxekov792@estudys.com', 'quickbrown1', 'Alex', 'Smith');
        quiz = adminQuizCreate(userId.authUserId, 'Australia', 'description');
    });

    // Error cases for AdminQuizCreate function
    test('invalid authUserId', () => {
        clear();
        expect(adminQuizCreate(userId.authUserId, 'human history', 'description')).toStrictEqual(ERROR);
    });

    test.each([
        { name: ''}, // empty
        { name: '!23'}, // invalid char
        { name: '!*^&'}, // invalid char
        { name: 'qw'}, // < 2 chars
        { name: '12'}, // < 2 chars
        { name: 'qwerty'.repeat(6)}, // > 30 chars
    ])('invalid name input: $name', ({ name }) => {
        expect(adminQuizCreate(userId.authUserId, name, 'description')).toStrictEqual(ERROR);
    });

    const longDescription = 'description'.repeat(10);
    test('description too long', () => {
        expect(adminQuizCreate(userId.authUserId, 'games', longDescription)).toStrictEqual(ERROR);
    });

    test('existing quiz name', () => {
        expect(adminQuizCreate(userId.authUserId, 'Australia', 'description')).toStrictEqual(ERROR);
    });

    // Success case for adminQuizCreate function
    test('Valid input', () => {
        expect(adminQuizCreate(userId.authUserId, 'human history', 'description')).toStrictEqual({
            quizId: expect.any(Number),
        });
    });

    test('Valid input, description empty', () => {
        expect(adminQuizCreate(userId.authUserId, 'human history', '')).toStrictEqual({
            quizId: expect.any(Number),
        });
    });
});

// Tests for adminQuizNameUpdate function
describe('adminQuizNameUpdate', () => {
    let newUser;
    let newQuiz;
    beforeEach(() => {
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
