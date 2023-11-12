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
    test('Token is empty', () => {
      expect(() => requestUserDetailsUpdate('', validDetails.EMAIL_2, validDetails.FIRST_NAME_2, validDetails.LAST_NAME_2)).toThrow(HTTPError[401]);
    });
    test('Token is invalid', () => {
      expect(() => requestUserDetailsUpdate(token.token + 1, validDetails.EMAIL_2, validDetails.FIRST_NAME_2, validDetails.LAST_NAME_2)).toThrow(HTTPError[401]);
    });

    const testCases = [
      ['Existing email', validDetails.EMAIL_2, validDetails.FIRST_NAME_2, validDetails.LAST_NAME_2],
      ['Invalid email', 'hello', validDetails.FIRST_NAME_2, validDetails.LAST_NAME_2],
      ['First name has forbidden characters', validDetails.EMAIL_2, 'hello!', validDetails.LAST_NAME_2],
      ['First name too short', validDetails.EMAIL_2, 'h', validDetails.LAST_NAME_2],
      ['First name too long', validDetails.EMAIL_2, 'hellohellohellohellohello', validDetails.LAST_NAME_2],
      ['Last name has forbidden characters', validDetails.EMAIL_2, validDetails.FIRST_NAME_2, 'world!'],
      ['Last name too short', validDetails.EMAIL_2, validDetails.FIRST_NAME_2, 'w'],
      ['Last name too long', validDetails.EMAIL_2, validDetails.FIRST_NAME_2, 'worldworldworldworldworld'],
    ];

    test.each(testCases)('%s', (description, email, firstName, lastName) => {
      if (description === 'Existing email') {
        requestAuthRegister(validDetails.EMAIL_2, validDetails.PASSWORD_2, validDetails.FIRST_NAME_2, validDetails.LAST_NAME_2);
      }
      expect(() => requestUserDetailsUpdate(token.token, email, firstName, lastName)).toThrow(HTTPError[400]);
    });
  });
});
