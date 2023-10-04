import { adminQuizCreate, adminQuizList } from './quiz';
import { adminAuthRegister, adminAuthLogin } from './auth';
import { clear } from './other';

const ERROR = {error: expect.any(String)};
    beforeEach(() => {
        clear();    
    });

    describe('AdminQuizCreate', () => {
        // Error cases for AdminQuizCreate function
        let userId;
        let quizzes;
        describe('error cases:', () => {
            beforeEach(() => {
                userId = adminAuthRegister('voxekov792@estudys.com', 'quickbrown', 'Alex', 'Smith');
            });
            
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
                console.log(adminQuizCreate(userId.authUserId, 'games', longDescription));
                expect(adminQuizCreate(userId.authUserId, 'games', longDescription)).toStrictEqual(ERROR);
            });

        });

        // Success case for adminQuizCreate function
        describe('success case:', () => {
            let userId;
            test('Valid input', () => {
                userId = adminAuthRegister('voxekov792@estudys.com', 'quickbrown', 'Alex', 'Smith');
                expect(adminQuizCreate(userId.authUserId, 'human history', 'description')).toStrictEqual({
                    quizId: expect.any(Number),
                });
            });
        });
    });

    




