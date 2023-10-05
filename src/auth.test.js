import {
    adminQuizNameUpdate, 
    adminQuizCreate,
} from './quiz';

import {
    adminAuthRegister,
    adminAuthLogin,
    adminUserDetails,
} from './auth';

import {
    clear
} from './other';

const ERROR = { error: expect.any(String) }

beforeEach(() => {
    clear();
});

// Success and fail tests for adminAuthRegister
describe('Tests for adminAuthRegister', () => {
    test('Existing email', () => {
        adminAuthRegister('hello@gmail.com', 'password1', 'hello', 'world');
        expect(adminAuthRegister('hello@gmail.com', 'password1', 'hello', 'world')).toEqual({ error: expect.any(String) });
    });
    test('Invalid email', () => {
        expect(adminAuthRegister('hello', 'password1', 'hello', 'world')).toEqual({ error: expect.any(String) }); 
    });
    test('First name has forbidden characters', () => {
        expect(adminAuthRegister('hello@gmail.com', 'password1', 'hello!', 'world')).toEqual({ error: expect.any(String) }); 
    });
    test('First name too short', () => {
        expect(adminAuthRegister('hello@gmail.com', 'password1', 'h', 'world')).toEqual({ error: expect.any(String) }); 
    });
    test('First name too long', () => {
        expect(adminAuthRegister('hello@gmail.com', 'password1', 'hellohellohellohellohello', 'world')).toEqual({ error: expect.any(String) }); 
    });
    test('Last name has forbidden characters', () => {
        expect(adminAuthRegister('hello@gmail.com', 'password1', 'hello', 'world!')).toEqual({ error: expect.any(String) }); 
    });
    test('Last name too short', () => {
        expect(adminAuthRegister('hello@gmail.com', 'password1', 'hello', 'w')).toEqual({ error: expect.any(String) }); 
    });
    test('Last name too long', () => {
        expect(adminAuthRegister('hello@gmail.com', 'password1', 'hello', 'worldworldworldworldworld')).toEqual({ error: expect.any(String) }); 
    });
    test('Password less than 8 characters', () => {
        expect(adminAuthRegister('hello@gmail.com', 'pass', 'hello', 'world')).toEqual({ error: expect.any(String) }); 
    });
    test('Password does not contain at least one number and at least one letter', () => {
        expect(adminAuthRegister('hello@gmail.com', 'password', 'hello', 'world')).toEqual({ error: expect.any(String) });
    });
    test('Valid email, password, first name and last name', () => {
        expect(adminAuthRegister('hello@gmail.com', 'password1', 'hello', 'world')).toEqual({ authUserId: expect.any(Number) });
    });
});


// Tests for adminUserDetails function
describe('adminUserDetails', () => {
    let user;
    let userDetails;

    // Success cases for adminUserDetails function
    describe('Success Cases', () => {
        beforeEach(() => {
            clear();
            user = adminAuthRegister('johnsmith@gmail.com', 'ilovecat123', 'John', 'Smith');
            userDetails = adminUserDetails(user.authUserId);
        });

        test('Successful implementation', () => {        
            expect(adminUserDetails(user.authUserId)).toEqual({
                user: {
                    userId: user.authUserId,
                    name: 'John Smith',
                    email: 'johnsmith@gmail.com',
                    numSuccessfulLogins: 1, 
                    numFailedPasswordsSinceLastLogin: 0, 
                },
            });
        });
    });

    // Error cases for adminUserDetails function
    describe('Error cases', () => {
        test('AuthUserId is not a valid user', () => {
            user = adminAuthRegister('johnsmith@gmail.com', 'ilovecat123', 'John', 'Smith');
            clear();
            expect(adminUserDetails(user.authUserId)).toEqual(ERROR);
        });
    });
}); 
