import {
  validDetails,
  TokenReturn,
  UserDetailsReturn,
} from '../types';

import {
  requestAuthRegister,
  requestAuthLogin,
  requestUserDetails,
  requestClear,
} from './wrapper';

import HTTPError from 'http-errors';

// Tests for function adminAuthLogin
describe('Tests for adminAuthLogin', () => {
  let token: TokenReturn;
  let validUserDetails: UserDetailsReturn;

  beforeEach(() => {
    requestClear();
    token = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    requestAuthRegister(validDetails.EMAIL_2, validDetails.PASSWORD_2, validDetails.FIRST_NAME_2, validDetails.LAST_NAME_2);
  });
  // Success cases for adminAuthLogin
  describe('Success Cases', () => {
    test('Returns token successfully', () => {
      expect(requestAuthLogin(validDetails.EMAIL, validDetails.PASSWORD)).toEqual({ token: expect.any(String) });
      expect(requestAuthLogin(validDetails.EMAIL_2, validDetails.PASSWORD_2)).toEqual({ token: expect.any(String) });
    });
    test('Updates numSuccessfulLogin for users correctly', () => {
      requestAuthLogin(validDetails.EMAIL, validDetails.PASSWORD);
      requestAuthLogin(validDetails.EMAIL, validDetails.PASSWORD);
      requestAuthLogin(validDetails.EMAIL, validDetails.PASSWORD);
      validUserDetails = requestUserDetails(token.token);
      expect(validUserDetails.user.numSuccessfulLogins).toEqual(4);
    });
    test('Updates FailedPasswordsSinceLastLogin for users correctly', () => {
      requestAuthLogin(validDetails.EMAIL, validDetails.PASSWORD_2);
      requestAuthLogin(validDetails.EMAIL, validDetails.PASSWORD_2);
      requestAuthLogin(validDetails.EMAIL, validDetails.PASSWORD_2);
      validUserDetails = requestUserDetails(token.token);
      expect(validUserDetails.user.numFailedPasswordsSinceLastLogin).toEqual(3);
      requestAuthLogin(validDetails.EMAIL, validDetails.PASSWORD);
      validUserDetails = requestUserDetails(token.token);
      expect(validUserDetails.user.numSuccessfulLogins).toEqual(2);
      expect(validUserDetails.user.numFailedPasswordsSinceLastLogin).toEqual(0);
    });
  });
  // Error cases for adminAuthLogin
  describe('Error Cases', () => {
    const invalidEmail = 'jamesbrown@gmail.com';

    test('Testing invalid email', () => {
      expect(() => requestAuthLogin(invalidEmail, validDetails.PASSWORD).toThrow(HTTPError[400]));
    });
    test('Testing incorrect password', () => {
      expect(() => requestAuthLogin(validDetails.EMAIL, validDetails.PASSWORD_2).toThrow(HTTPError[400]));
    });
  });
});
