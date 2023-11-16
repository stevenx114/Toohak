import {
  TokenReturn,
  validDetails
} from '../types';

import {
  requestClear,
  requestAuthRegister,
  requestAdminUpdateUserPasswordV2,
  requestAuthLogin,
  requestUserDetails,
} from './wrapper';

import HTTPError from 'http-errors';

let token: TokenReturn;

beforeEach(() => {
  requestClear();
  token = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
});
describe('Tests for adminUpdateUserPassword', () => {
  const newPassword = 'newPassword1';
  const newerPassword = 'newPassword2';
  describe('Success Case', () => {
    test('Updates password correctly', () => {
      expect(requestAdminUpdateUserPasswordV2(token.token, validDetails.PASSWORD, newPassword)).toStrictEqual({});
      requestAuthLogin(validDetails.EMAIL, newPassword);
      expect(() => requestAuthLogin(validDetails.EMAIL, validDetails.PASSWORD).toThrow(HTTPError[400]));
      requestAdminUpdateUserPasswordV2(token.token, newPassword, newerPassword);
      requestAuthLogin(validDetails.EMAIL, newerPassword);
      expect(() => requestAuthLogin(validDetails.EMAIL, newPassword).toThrow(HTTPError[400]));
    });
    test('Updates user details correctly', () => {
      expect(requestAdminUpdateUserPasswordV2(token.token, validDetails.PASSWORD, newPassword)).toStrictEqual({});
      expect(() => requestAuthLogin(validDetails.EMAIL, validDetails.PASSWORD)).toThrow(HTTPError[400]);
      expect(() => requestAuthLogin(validDetails.EMAIL, validDetails.PASSWORD)).toThrow(HTTPError[400]);
      expect(() => requestAuthLogin(validDetails.EMAIL, validDetails.PASSWORD)).toThrow(HTTPError[400]);
      expect(requestUserDetails(token.token).user.numFailedPasswordsSinceLastLogin).toEqual(3);
      requestAuthLogin(validDetails.EMAIL, newPassword);
      expect(requestUserDetails(token.token).user.numSuccessfulLogins).toEqual(2);
    });
  });
  describe('Error Cases', () => {
    test('Token is empty', () => {
      expect(() => requestAdminUpdateUserPasswordV2('', validDetails.PASSWORD, newPassword)).toThrow(HTTPError[401]);
    });
    test('Token is invalid', () => {
      expect(() => requestAdminUpdateUserPasswordV2(token.token + 1, validDetails.PASSWORD, newPassword)).toThrow(HTTPError[401]);
    });

    test('Old password same as new password', () => {
      expect(() => requestAdminUpdateUserPasswordV2(token.token, validDetails.PASSWORD, validDetails.PASSWORD)).toThrow(HTTPError[400]);
    });
    test('Old password is not the same as current password', () => {
      expect(() => requestAdminUpdateUserPasswordV2(token.token, 'samplePassword1', validDetails.PASSWORD)).toThrow(HTTPError[400]);
    });
    test('New Password has already been used before by this User', () => {
      // Assume that the first call to requestAdminUpdateUserPassword is part of the setup and does not throw.
      requestAdminUpdateUserPasswordV2(token.token, validDetails.PASSWORD, newPassword);
      expect(() => requestAdminUpdateUserPasswordV2(token.token, newPassword, validDetails.PASSWORD)).toThrow(HTTPError[400]);
    });
    test('New Password is less than 8 characters', () => {
      expect(() => requestAdminUpdateUserPasswordV2(token.token, validDetails.PASSWORD, 'abcdef1')).toThrow(HTTPError[400]);
    });
    test('New Password does not contain at least one letter', () => {
      expect(() => requestAdminUpdateUserPasswordV2(token.token, validDetails.PASSWORD, '12345678')).toThrow(HTTPError[400]);
    });
    test('New Password does not contain at least one number', () => {
      expect(() => requestAdminUpdateUserPasswordV2(token.token, validDetails.PASSWORD, 'abcdefgh')).toThrow(HTTPError[400]);
    });
  });
});
