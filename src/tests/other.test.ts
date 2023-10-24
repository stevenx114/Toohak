import {
  clear
} from '../other';

import {
  adminAuthRegister,
  adminUserDetails
} from '../auth';

import {
  adminQuizList,
  adminQuizCreate
} from '../quiz';

import { 
  AuthUserIdReturn,
  validDetails, 
  ErrorObject
} from '../types';

const ERROR = { error: expect.any(String) };

describe('Clear Function implementation', () => {
  let authUserId: AuthUserIdReturn | ErrorObject;

  beforeEach(() => {
    authUserId = adminAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);

    if ('authUserId' in authUserId) {
      adminQuizCreate(authUserId.authUserId, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
    } else {
      console.error('error in adminQuizCreate');
      expect(false).toBe(true);
    }
  });

  test('Returns empty dictionary', () => {
    expect(clear()).toStrictEqual({});
  });

  test('Removing user data', () => {
    expect(clear()).toStrictEqual({});

    if ('authUserId' in authUserId) {
      expect(adminUserDetails(authUserId.authUserId)).toStrictEqual(ERROR);
    } else {
      console.error('error in adminUserDetails');
      expect(false).toBe(true);
    }
  });

  test('Removing quiz data', ()=> {
    expect(clear()).toStrictEqual({});
    authUserId = adminAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);

    if ('authUserId' in authUserId) {
      expect(adminQuizList(authUserId.authUserId)).toStrictEqual({quizzes: []});
    } else {
      console.error('error in adminQuizList');
      expect(false).toBe(true);
    } 
  });
});