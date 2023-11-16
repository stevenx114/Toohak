import {
  validDetails
} from '../types';

import {
  requestAuthRegister,
  requestClear
} from './wrapper';

import HTTPError from 'http-errors';

beforeEach(() => {
  requestClear();
});

afterEach(() => {
  requestClear();
});

// Success and error tests for /v1/admin/auth/register
describe('POST /v1/admin/auth/register', () => {
  describe('Success Cases', () => {
    test('Valid email, password, first name and last name', () => {
      expect(requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME)).toEqual({ token: expect.any(String) });
    });
  });

  describe('Error Cases', () => {
    test.each([
      ['Existing email', validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME],
      ['Invalid email', 'hello', validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME],
      ['First name has forbidden characters', validDetails.EMAIL, validDetails.PASSWORD, 'hello!', validDetails.LAST_NAME],
      ['First name too short', validDetails.EMAIL, validDetails.PASSWORD, 'h', validDetails.LAST_NAME],
      ['First name too long', validDetails.EMAIL, validDetails.PASSWORD, 'hellohellohellohellohello', validDetails.LAST_NAME],
      ['Last name has forbidden characters', validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, 'world!'],
      ['Last name too short', validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, 'w'],
      ['Last name too long', validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, 'worldworldworldworldworld'],
      ['Password less than 8 characters', validDetails.EMAIL, 'pass', validDetails.FIRST_NAME, validDetails.LAST_NAME],
      ['Password does not contain at least one number', validDetails.EMAIL, 'password', validDetails.FIRST_NAME, validDetails.LAST_NAME],
      ['Password does not contain at least one letter', validDetails.EMAIL, '12345678', validDetails.FIRST_NAME, validDetails.LAST_NAME],
    ])('%s', (testName, email, password, firstName, lastName) => {
      if (testName === 'Existing email') {
        requestAuthRegister(email, password, firstName, lastName);
      }
      expect(() => requestAuthRegister(email, password, firstName, lastName)).toThrow(HTTPError[400]);
    });
  });
});
