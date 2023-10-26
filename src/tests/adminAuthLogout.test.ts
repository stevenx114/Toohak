import {
  validDetails,
  TokenReturn,
  ErrorObject
} from '../types';

import {
  requestAuthRegister,
  requestClear,
  requestLogout
} from './wrapper';

const ERROR = expect.any(String);

beforeEach(() => {
  requestClear();
});

describe('POST /v1/admin/auth/logout', () => {
  let errorReturn: ErrorObject;
  let userToken: TokenReturn;
  describe('Success Cases', () => {
    test('All inputs are valid', () => {
      userToken = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
      expect(requestLogout(userToken.token)).toEqual({});
    });
  });

  describe('Error Cases', () => {
    test('Token is invalid', () => {
      errorReturn = requestLogout('');
      expect(errorReturn.error).toEqual(ERROR);
      expect(errorReturn.statusCode).toEqual(401);
    });
  });
});
