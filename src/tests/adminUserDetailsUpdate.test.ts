import {
  TokenReturn,
  validDetails,
  UserDetailsReturn,
} from '../types';

import {
  requestAuthRegister,
  requestUserDetails,
  requestClear,
  requestUserDetailsUpdate,
} from './wrapper';

import HTTPError from 'http-errors';

beforeEach(() => {
  requestClear();
});

// Tests for adminUserDetailsUpdate function
describe('PUT /v1/admin/user/details', () => {
  let token: TokenReturn;
  let userDetails: UserDetailsReturn;
  beforeEach(() => {
    token = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
  });

  // Success cases for adminUserDetailsUpdate function
  describe('Success Cases', () => {
    test('Successful implementation', () => {
      expect(requestUserDetailsUpdate(token.token, validDetails.EMAIL_2, validDetails.FIRST_NAME_2, validDetails.LAST_NAME_2)).toEqual({});
      userDetails = requestUserDetails(token.token);
      expect(userDetails.user.email).toEqual(validDetails.EMAIL_2);
      expect(userDetails.user.name).toEqual(`${validDetails.FIRST_NAME_2} ${validDetails.LAST_NAME_2}`);
    });
  });

  // Error cases for adminUserDetailsUpdate function
  describe('Error cases', () => {
    token = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    const invalidToken = token.token + 1;
    const testCases = [
      ['Token is empty', '', validDetails.EMAIL_2, validDetails.FIRST_NAME_2, validDetails.LAST_NAME_2],
      ['Token is invalid', invalidToken, validDetails.EMAIL_2, validDetails.FIRST_NAME_2, validDetails.LAST_NAME_2],
      ['Existing email', token.token, validDetails.EMAIL_2, validDetails.FIRST_NAME_2, validDetails.LAST_NAME_2],
      ['Invalid email', token.token, 'hello', validDetails.FIRST_NAME_2, validDetails.LAST_NAME_2],
      ['First name has forbidden characters', token.token, validDetails.EMAIL_2, 'hello!', validDetails.LAST_NAME_2],
      ['First name too short', token.token, validDetails.EMAIL_2, 'h', validDetails.LAST_NAME_2],
      ['First name too long', token.token, validDetails.EMAIL_2, 'hellohellohellohellohello', validDetails.LAST_NAME_2],
      ['Last name has forbidden characters', token.token, validDetails.EMAIL_2, validDetails.FIRST_NAME_2, 'world!'],
      ['Last name too short', token.token, validDetails.EMAIL_2, validDetails.FIRST_NAME_2, 'w'],
      ['Last name too long', token.token, validDetails.EMAIL_2, validDetails.FIRST_NAME_2, 'worldworldworldworldworld'],
    ];

    test.each(testCases)('%s', (testName, tokenValue, email, firstName, lastName) => {
      expect(() => requestUserDetailsUpdate(tokenValue, email, firstName, lastName).toThrow(HTTPError[401]));
    });
  });
});
