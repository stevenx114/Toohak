import {
  validDetails,
  TokenReturn,
} from '../types';

import {
  requestAuthRegister,
  requestUserDetails,
  requestClear,
  requestLogout
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
      expect(requestLogout(userToken.token)).toEqual({});
      expect(() => requestUserDetails(userToken.token)).toThrow(HTTPError[401]);
    });
  });

  describe('Error Cases', () => {
    test('Token is empty', () => {
      expect(() => requestLogout('')).toThrow(HTTPError[401]);
    });

    test('Token is invalid', () => {
      expect(() => requestLogout('invalidToken')).toThrow(HTTPError[401]);
    });
  });
});
