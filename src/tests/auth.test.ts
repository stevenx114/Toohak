import {
  adminAuthRegister,
  adminAuthLogin,
  adminUserDetails,
} from '../auth';

import {
  clear
} from '../other';

import {
  ErrorObject,
  AuthUserIdReturn,
  validDetails
} from '../types';

const ERROR = { error: expect.any(String) };

beforeEach(() => {
  clear();
});

// Success and fail tests for adminAuthRegister
describe('Tests for adminAuthRegister', () => {
  test('Existing email', () => {
    adminAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    expect(adminAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME)).toEqual({ error: expect.any(String) });
  });
  test('Invalid email', () => {
    expect(adminAuthRegister('hello', validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME)).toEqual({ error: expect.any(String) });
  });
  test('First name has forbidden characters', () => {
    expect(adminAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, 'hello!', validDetails.LAST_NAME)).toEqual({ error: expect.any(String) });
  });
  test('First name too short', () => {
    expect(adminAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, 'h', validDetails.LAST_NAME)).toEqual({ error: expect.any(String) });
  });
  test('First name too long', () => {
    expect(adminAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, 'hellohellohellohellohello', validDetails.LAST_NAME)).toEqual({ error: expect.any(String) });
  });
  test('Last name has forbidden characters', () => {
    expect(adminAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, 'world!')).toEqual({ error: expect.any(String) });
  });
  test('Last name too short', () => {
    expect(adminAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, 'w')).toEqual({ error: expect.any(String) });
  });
  test('Last name too long', () => {
    expect(adminAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, 'worldworldworldworldworld')).toEqual({ error: expect.any(String) });
  });
  test('Password less than 8 characters', () => {
    expect(adminAuthRegister(validDetails.EMAIL, 'pass', validDetails.FIRST_NAME, validDetails.LAST_NAME)).toEqual({ error: expect.any(String) });
  });
  test('Password does not contain at least one number and at least one letter', () => {
    expect(adminAuthRegister(validDetails.EMAIL, 'password', validDetails.FIRST_NAME, validDetails.LAST_NAME)).toEqual({ error: expect.any(String) });
  });
  test('Valid email, password, first name and last name', () => {
    expect(adminAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME)).toEqual({ authUserId: expect.any(Number) });
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
