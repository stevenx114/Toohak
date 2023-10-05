import { adminQuizCreate, adminQuizList } from './quiz';
import { adminAuthRegister, adminAuthLogin } from './auth';
import { clear } from './other';

const ERROR = {error: expect.any(String)};

beforeEach(() => {
    clear();
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