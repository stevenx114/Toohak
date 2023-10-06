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
                userId: user.authUserId,
                name: 'John Smith',
                email: 'johnsmith@gmail.com',
                numSuccessfulLogins: 1, 
                numFailedPasswordsSinceLastLogin: 0, 
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

// Tests for function adminAuthLogin
describe('Tests for adminAuthLogin', () => {
    const userOne = {
        email: 'johnsmith@gmail.com',
        password: 'ilovecat123',
        nameFirst: 'john',
        nameLast: 'smith'
    };
    const userTwo = {
        email: 'thomasapple@gmail.com',
        password: 'helloworld123',
        nameFirst: 'thomas',
        nameLast: 'apple'
    };
    let userIdOne;
    let userIdTwo;
    beforeEach(() => {
        clear();
        userIdOne = adminAuthRegister(userOne.email, userOne.password, userOne.nameFirst, userOne.nameLast); 
        userIdTwo = adminAuthRegister(userTwo.email, userTwo.password, userTwo.nameFirst, userTwo.nameLast); 
    })
    // Success cases for adminAuthLogin
    describe('Success Cases', () => {
        test('Returns userId successfully',() => {
            expect(adminAuthLogin(userOne.email, userOne.password)).toEqual({authUserId: userIdOne.authUserId});
            expect(adminAuthLogin(userTwo.email, userTwo.password)).toEqual({authUserId: userIdTwo.authUserId});
        })
        test('Updates numSuccessfulLogin for users correctly', () => {
            adminAuthLogin(userOne.email, userOne.password);
            adminAuthLogin(userOne.email, userOne.password);
            adminAuthLogin(userOne.email, userOne.password);
            expect(adminUserDetails(userIdOne.authUserId).numSuccessfulLogins).toEqual(4);
        })
        test('Updates FailedPasswordsSinceLastLogin for users correctly', () => {
            adminAuthLogin(userOne.email, userTwo.password);
            adminAuthLogin(userOne.email, userTwo.password);
            adminAuthLogin(userOne.email, userTwo.password);
            expect(adminUserDetails(userIdOne.authUserId).numFailedPasswordsSinceLastLogin).toEqual(3);
            adminAuthLogin(userOne.email, userOne.password);
            expect(adminUserDetails(userIdOne.authUserId).numSuccessfulLogins).toEqual(2);
            expect(adminUserDetails(userIdOne.authUserId).numFailedPasswordsSinceLastLogin).toEqual(0);
        })
    })
    // Error cases for adminAuthLogin
    describe('Error Cases', () => {
        const invalidEmail = 'jamesbrown@gmail.com';
        test('Testing invalid email', () => {
            expect(adminAuthLogin(invalidEmail, userOne.password)).toEqual({error: expect.any(String)});
        })
        test('Testing incorrect password', () => {
            expect(adminAuthLogin(userOne.email, userTwo.password)).toEqual({error: expect.any(String)});
        })
    })
})


