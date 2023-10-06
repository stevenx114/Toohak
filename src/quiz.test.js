import {    
    adminAuthRegister, 
    adminAuthLogin,
} from './auth';

import {
    adminQuizInfo,
    adminQuizCreate,
    adminQuizList,
    adminQuizNameUpdate, 
    adminQuizRemove
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

describe('Tests for adminQuizRemove', () => {
    const userOne = {
        email: 'johnsmith@gmail.com',
        password: 'ilovecat123',
        nameFirst: 'john',
        nameLast: 'smith'
    };
    const noQuizUser = {
        email: 'thomasapple@gmail.com',
        password: 'helloworld123',
        nameFirst: 'thomas',
        nameLast: 'apple'
    };
    let userIdOne;
    let noQuizUserId;
    let quizOne;
    let quizTwo;
    beforeEach(() => {
        clear();
        userIdOne = adminAuthRegister(userOne.email, userOne.password, userOne.nameFirst, userOne.nameLast); 
        noQuizUserId = adminAuthRegister(noQuizUser.email, noQuizUser.password, noQuizUser.nameFirst, noQuizUser.nameLast); 
        quizOne = adminQuizCreate(userIdOne.authUserId, 'testQuizOne', 'descriptionOne');
        quizTwo = adminQuizCreate(userIdOne.authUserId, 'testQuizTwo', 'descriptionTwo');
    })
    describe('Success cases', () => {
        test('Successful removal of quiz one', () => {
            adminQuizRemove(userIdOne.authUserId, quizOne.quizId);
            expect(adminQuizList(userIdOne.authUserId)).toStrictEqual({
                quizzes: [
                    {
                        quizId: quizTwo.quizId,
                        name: 'testQuizTwo'
                    }
                ]
            })
        })
        test('Successful removal of quiz two', () => {
            expect(adminQuizRemove(userIdOne.authUserId, quizTwo.quizId)).toEqual({});
            expect(adminQuizList(userIdOne.authUserId)).toStrictEqual({
                quizzes: [
                    {
                        quizId: quizOne.quizId,
                        name: 'testQuizOne'
                    }
                ]
            })
        })
    })
    describe('Error Cases', () => {
        test('Testing for invalid user Id', () => {
            clear();
            expect(adminQuizRemove(userIdOne.authUserId, quizOne.quizId)).toStrictEqual(ERROR);
        })
        test('Testing for invalid quiz Id', () => {
            clear();
            userIdOne = adminAuthRegister(userOne.email, userOne.password, userOne.nameFirst, userOne.nameLast); 
            expect(adminQuizRemove(userIdOne.authUserId, quizOne.quizId)).toStrictEqual(ERROR);
        })
        test('Quiz Id does not refer to a quiz that this user owns', () => {
            expect(adminQuizRemove(noQuizUserId.authUserId, quizOne.quizId)).toStrictEqual(ERROR);
        })
    })
 })

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

describe('AdminQuizList', () => {
    let userId;
    let quiz;
    let quiz1;
    beforeEach(() => {
        userId = adminAuthRegister('voxekov792@estudys.com', 'quickbrown1', 'Alex', 'Smith');
        quiz = adminQuizCreate(userId.authUserId, 'human history', 'description');
    });

    // error case
    test('invalid authUserId', () => {
        clear();
        expect(adminQuizList(userId.authUserId)).toStrictEqual(ERROR);
    });

    // success cases:
    test('valid input of 1 quiz', () => {
        expect(adminQuizList(userId.authUserId)).toStrictEqual({
            quizzes: [
                {
                    quizId: quiz.quizId,
                    name: 'human history',
                }
            ]
        });
    });

    test('valid input of 2 quizzes', () => {
        quiz1 = adminQuizCreate(userId.authUserId, 'animals', 'description');
        expect(adminQuizList(userId.authUserId)).toStrictEqual({
            quizzes: [
                {
                    quizId: quiz.quizId,
                    name: 'human history',
                },
                {
                    quizId: quiz1.quizId,
                    name: 'animals',
                },
            ]
        });
    });
});