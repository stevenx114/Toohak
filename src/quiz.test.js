import { adminQuizCreate, adminQuizList } from './quiz';
import { adminAuthRegister, adminAuthLogin } from './auth';
import { clear } from './other';

const ERROR = {error: expect.any(String)};

beforeEach(() => {
    clear();
});

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