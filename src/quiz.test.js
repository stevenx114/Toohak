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
        userId = adminAuthRegister('voxekov792@estudys.com', 'quickbrown', 'Alex', 'Smith');
    });
  
    describe('error cases:', () => {
        test('invalid AuthUserId', () => {
            clear();
            expect(adminQuizList(userId.authUserId)).toStrictEqual(ERROR);
        });
    });
    
    describe('success cases:', () => {
        test('valid input', () => {
            quiz = adminQuizCreate(userId.authUserId, 'human history', 'description');
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
  });