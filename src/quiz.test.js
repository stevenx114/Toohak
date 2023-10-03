import { adminQuizCreate, adminQuizList } from './quiz.js';
import { adminAuthRegister, adminAuthLogin } from './auth.js';
import { clear } from './other.js';

const ERROR = {error: expect.any(String)};
    beforeEach(() => {
        clear();    
    });

    describe('AdminQuizCreate', () => {
        describe('error cases:', () => {
            beforeEach(() => {
                const userId = adminAuthRegister('voxekov792@estudys.com', 'quickbrown', 'Alex', 'Smith');
                const quizzes = adminQuizList(userId.authUserId);
            });

            const userId = adminAuthRegister('voxekov792@estudys.com', 'quickbrown', 'Alex', 'Smith');
            test('invalid AuthUserId', () => {
                expect(adminQuizCreate(userId.authUserId + 0.003, 'human history', 'description')).toStrictEqual(ERROR);
            })

            const invalidName = [
                { name: ''}, // empty
                { name: '!23'}, // invalid char
                { name: '!*^&'}, // invalid char
                { name: 'qw'}, // < 2 chars
                { name: '12'}, // < 2 chars
                { name: 'qwerty'.repeat(6)}, // > 30 chars
            ];
            test.each(invalidName) ('invalid name input: $name', ({ name }) => {
                expect(adminQuizCreate(userId.authUserId, name, 'description')).toStrictEqual(ERROR);
            });

            test('existing quiz name', () => {
                expect(adminQuizCreate(userId.authUserId, quizzes.name, 'description')).toStrictEqual(ERROR);
            });

            test('description too long', () => {
                expect(adminQuizCreate(userId.authUserId, 'games', 'description'.repeat(10))).toStrictEqual(ERROR);
            });

        });

        describe('success cases:', () => {
            const userId = adminAuthRegister('voxekov792@estudys.com', 'quickbrown', 'Alex', 'Smith');
            test('Valid input', () => {
                expect(adminQuizCreate(userId.authUserId, 'human history', 'description')).toStrictEqual({
                    quizId: expect.any(Number),
                });
            });
        });
    });

    




