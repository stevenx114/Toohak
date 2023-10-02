import {
    adminAuthRegister,
    adminAuthLogin,
    adminUserDetails
} from './auth';

import {
    clear
} from './other';

const ERROR = { error: expect.any(String) }

describe('adminUserDetails Test', () => {
    let user;
    let userDetails;

    describe('Success Cases', () => {
    beforeEach(() => {
        clear();
        user = adminAuthRegister('johnsmith@gmail.com', 'ilovecat123', 'John', 'Smith');
        userDetails = adminUserDetails(user.authUserId);
    });

    test('Successful implementation', () => {        
        expect(userDetails).toEqual({
          user: {
            userId: user.authUserId,
            name: 'John Smith',
            email: 'johnsmith@gmail.com',
            numSuccessfulLogins: 1, 
            numFailedPasswordsSinceLastLogin: 0, 
          },
        })
    });

    });

    describe('Error cases', () => {
        test('AuthUserId is not a valid user', () => {
            clear();
            expect(adminUserDetails(user.authUserId).toEqual(ERROR));
        });
    });
}); 