import {
  TokenReturn,
  validDetails
} from '../types';

import {
  requestAuthRegister,
  requestUserDetailsV2,
  requestClear,
} from './wrapper';

import HTTPError from 'http-errors';

beforeEach(() => {
  requestClear();
});

afterEach(() => {
  requestClear();
});

// Tests for adminUserDetails function
describe('GET /v2/admin/user/details', () => {
  let token: TokenReturn;

  // Success cases for adminUserDetails function
  describe('Success Cases', () => {
    beforeEach(() => {
      token = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    });

    test('Successful implementation', () => {
      expect(requestUserDetailsV2(token.token)).toEqual({
        user: {
          userId: expect.any(Number),
          name: 'firstname lastname',
          email: validDetails.EMAIL,
          numSuccessfulLogins: 1,
          numFailedPasswordsSinceLastLogin: 0,
        }
      });
    });
  });

  // Error cases for adminUserDetails function
  describe('Error cases', () => {
    test('Token is empty', () => {
      expect(() => requestUserDetailsV2('')).toThrow(HTTPError[401]);
    });
    test('Token is invalid', () => {
      expect(() => requestUserDetailsV2(token.token + 1)).toThrow(HTTPError[401]);
    });
  });
});
