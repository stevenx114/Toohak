import {
  validDetails,
  TokenReturn,
} from '../types';

import {
  requestAuthRegister,
  requestUserDetails,
  requestClear,
  requestLogoutV2
} from './wrapper';

import HTTPError from 'http-errors';

beforeEach(() => {
  requestClear();
});

describe('POST /v1/admin/auth/logout', () => {
  let userToken: TokenReturn;
  beforeEach(() => {
    userToken = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
  });

  describe('Success Cases', () => {
    test('All inputs are valid', () => {
      expect(requestLogoutV2(userToken.token)).toEqual({});
      expect(() => requestUserDetails(userToken.token)).toThrow(HTTPError[401]);
    });
  });

  describe('Error Cases', () => {
    test('Token is empty', () => {
      expect(() => requestLogoutV2('')).toThrow(HTTPError[401]);
    });

    test('Token is invalid', () => {
      expect(() => requestLogoutV2('invalidToken')).toThrow(HTTPError[401]);
    });
  });
});
