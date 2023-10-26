import {
  TokenReturn,
  validDetails,
  ErrorObject
} from '../types';

import {
  requestAuthRegister,
  requestUserDetails,
  requestClear,
} from './wrapper';

const ERROR = expect.any(String);

beforeEach(() => {
  requestClear();
});

// Tests for adminUserDetails function
describe('adminUserDetails', () => {
  let errorReturn: ErrorObject;
  let token: TokenReturn;

  // Success cases for adminUserDetails function
  describe('Success Cases', () => {
    beforeEach(() => {
      token = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    });

    test('Successful implementation', () => {
      expect(requestUserDetails(token.token)).toEqual({
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
      errorReturn = requestUserDetails('');
      expect(errorReturn.error).toEqual(ERROR);
      expect(errorReturn.statusCode).toEqual(401);
    });
    test('Token is invalid', () => {
      errorReturn = requestUserDetails(token.token + 1);
      expect(errorReturn.error).toEqual(ERROR);
      expect(errorReturn.statusCode).toEqual(401);
    });
  });
});
