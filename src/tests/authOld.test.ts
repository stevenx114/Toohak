import {
  adminAuthRegister,
  adminAuthLogin,
  adminUserDetails,
} from '../authOld';

import {
  clear
} from '../otherOld';

import {
  ErrorObject,
  AuthUserIdReturn,
  validDetails
} from '../types';

const ERROR = { error: expect.any(String) };

beforeEach(() => {
  clear();
});

// Success and error tests for adminAuthRegister
describe('Tests for adminAuthRegister', () => {
  describe('Success Cases', () => {
    test('Valid email, password, first name and last name', () => {
      expect(adminAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME)).toEqual({ token: expect.any(String) });
    });
  });

  describe('Error Cases', () => {
    test.each([
      ['Existing email', validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME],
      ['Invalid email', 'hello', validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME],
      ['First name has forbidden characters', validDetails.EMAIL, validDetails.PASSWORD, 'hello!', validDetails.LAST_NAME],
      ['First name too short', validDetails.EMAIL, validDetails.PASSWORD, 'h', validDetails.LAST_NAME],
      ['First name too long', validDetails.EMAIL, validDetails.PASSWORD, 'hellohellohellohellohello', validDetails.LAST_NAME],
      ['Last name has forbidden characters', validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, 'world!'],
      ['Last name too short', validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, 'w'],
      ['Last name too long', validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, 'worldworldworldworldworld'],
      ['Password less than 8 characters', validDetails.EMAIL, 'pass', validDetails.FIRST_NAME, validDetails.LAST_NAME],
      ['Password does not contain at least one number and at least one letter', validDetails.EMAIL, 'password', validDetails.FIRST_NAME, validDetails.LAST_NAME],
    ])('%s', (testName, email, password, firstName, lastName) => {
      if (testName === 'Existing email') {
        adminAuthRegister(email, password, firstName, lastName);
      }
      expect(adminAuthRegister(email, password, firstName, lastName)).toEqual(ERROR);
    });
  });
});

// Tests for adminUserDetails function
describe('adminUserDetails', () => {
  let userId: AuthUserIdReturn | ErrorObject;

  // Success cases for adminUserDetails function
  describe('Success Cases', () => {
    beforeEach(() => {
      clear();
      userId = adminAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    });

    test('Successful implementation', () => {
      if ('authUserId' in userId) {
        expect(adminUserDetails(userId.authUserId)).toEqual({
          user: {
            userId: userId.authUserId,
            name: 'firstname lastname',
            email: validDetails.EMAIL,
            numSuccessfulLogins: 1,
            numFailedPasswordsSinceLastLogin: 0,
          }
        });
      }
    });
  });

  // Error cases for adminUserDetails function
  describe('Error cases', () => {
    test('AuthUserId is not a valid user', () => {
      userId = adminAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
      clear();
      if ('authUserId' in userId) {
        expect(adminUserDetails(userId.authUserId)).toEqual(ERROR);
      }
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
  let userIdOne: AuthUserIdReturn | ErrorObject;
  let userIdTwo: AuthUserIdReturn | ErrorObject;
  beforeEach(() => {
    clear();
    userIdOne = adminAuthRegister(userOne.email, userOne.password, userOne.nameFirst, userOne.nameLast);
    userIdTwo = adminAuthRegister(userTwo.email, userTwo.password, userTwo.nameFirst, userTwo.nameLast);
  });
  // Success cases for adminAuthLogin
  describe('Success Cases', () => {
    test('Returns userId successfully', () => {
      if ('authUserId' in userIdOne && 'authUserId' in userIdTwo) {
        expect(adminAuthLogin(userOne.email, userOne.password)).toEqual({ authUserId: userIdOne.authUserId });
        expect(adminAuthLogin(userTwo.email, userTwo.password)).toEqual({ authUserId: userIdTwo.authUserId });
      }
    });
    test('Updates numSuccessfulLogin for users correctly', () => {
      adminAuthLogin(userOne.email, userOne.password);
      adminAuthLogin(userOne.email, userOne.password);
      adminAuthLogin(userOne.email, userOne.password);
      let userOneDetails;
      if ('authUserId' in userIdOne) {
        userOneDetails = adminUserDetails(userIdOne.authUserId);
      }
      if ('user' in userOneDetails) {
        expect(userOneDetails.user.numSuccessfulLogins).toEqual(4);
      }
    });
    test('Updates FailedPasswordsSinceLastLogin for users correctly', () => {
      adminAuthLogin(userOne.email, userTwo.password);
      adminAuthLogin(userOne.email, userTwo.password);
      adminAuthLogin(userOne.email, userTwo.password);
      let userOneDetails;
      if ('authUserId' in userIdOne) {
        userOneDetails = adminUserDetails(userIdOne.authUserId);
      }
      if ('user' in userOneDetails) {
        expect(userOneDetails.user.numFailedPasswordsSinceLastLogin).toEqual(3);
      }
      adminAuthLogin(userOne.email, userOne.password);

      if ('authUserId' in userIdOne) {
        userOneDetails = adminUserDetails(userIdOne.authUserId);
      }
      if ('user' in userOneDetails) {
        expect(userOneDetails.user.numSuccessfulLogins).toEqual(2);
        expect(userOneDetails.user.numFailedPasswordsSinceLastLogin).toEqual(0);
      }
    });
  });
  // Error cases for adminAuthLogin
  describe('Error Cases', () => {
    const invalidEmail = 'jamesbrown@gmail.com';
    test('Testing invalid email', () => {
      expect(adminAuthLogin(invalidEmail, userOne.password)).toEqual({ error: expect.any(String) });
    });
    test('Testing incorrect password', () => {
      expect(adminAuthLogin(userOne.email, userTwo.password)).toEqual({ error: expect.any(String) });
    });
  });
});
