import {
    adminAuthRegister,
    adminAuthLogin,
    adminUserDetails
} from './auth';

import {
    clear
} from './other';

const ERROR = { error: expect.any(String) }

// Tests for adminUserDetails function
describe('adminUserDetails Test', () => {
    let user;
    let userDetails;

    // Success cases for adminUserDetails function
    describe('Success Cases', () => {
        beforeEach(() => {
            clear();
            user = adminAuthRegister('johnsmith@gmail.com', 'ilovecat123', 'John', 'Smith');
            userDetails = adminUserDetails(user.userId);
        });

        test('Successful implementation', () => {        
            expect(userDetails).toEqual({
            user: {
                userId: user.userId,
                name: 'John Smith',
                email: 'johnsmith@gmail.com',
                numSuccessfulLogins: 1, 
                numFailedPasswordsSinceLastLogin: 0, 
            },
            })
        });

    });

    // Error cases for adminUserDetails function
    describe('Error cases', () => {
        test('AuthUserId is not a valid user', () => {
            user = adminAuthRegister('johnsmith@gmail.com', 'ilovecat123', 'John', 'Smith');
            clear();
            expect(adminUserDetails(user.userId).toEqual(ERROR));
        });
    });
}); 
