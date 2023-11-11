import {
  validDetails,
  TokenReturn,
  ErrorObject
} from '../types';

import {
  requestAuthRegister,
  requestUserDetails,
  requestClear,
  requestLogoutV2
} from './wrapper';

const ERROR = expect.any(String);

beforeEach(() => {
  requestClear();
});

describe('POST /v1/admin/auth/logout', () => {
  let errorReturn: ErrorObject;
  let userToken: TokenReturn;
  beforeEach(() => {
    userToken = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
  });

  describe('Success Cases', () => {
    test('All inputs are valid', () => {
      expect(requestLogoutV2(userToken.token)).toEqual({});
      errorReturn = requestUserDetails(userToken.token);
      expect(errorReturn.error).toEqual(ERROR);
      expect(errorReturn.statusCode).toEqual(401);
    });
  });

  describe('Error Cases', () => {
    test('Token is empty', () => {
      errorReturn = requestLogoutV2('');
      expect(errorReturn.error).toEqual(ERROR);
      expect(errorReturn.statusCode).toEqual(401);
    });

    test('Token is invalid', () => {
      errorReturn = requestLogoutV2('invalidToken');
      expect(errorReturn.error).toEqual(ERROR);
      expect(errorReturn.statusCode).toEqual(401);
    });
  });
});
