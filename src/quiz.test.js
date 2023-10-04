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
    beforeEach(() => {
        userId = adminAuthRegister('voxekov792@estudys.com', 'quickbrown1', 'Alex', 'Smith');
        console.log('this is ' + userId.authUserId);
        quiz = adminQuizCreate(userId.authUserId, 'human history', 'description');
    });
    // error case
    test('invalid authUserId', () => {
        clear();
        expect(adminQuizList(userId.authUserId)).toStrictEqual(ERROR);
    });
    // success case
    test('valid input', () => {
        expect(adminQuizList(userId.authUserId)).toStrictEqual({
            quizzes: [
                {
                    quizId: quiz.quizId,
                    name: 'human history',
                }
            ]
        });
    });
  });