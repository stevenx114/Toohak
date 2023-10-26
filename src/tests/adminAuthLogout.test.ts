import {
  validDetails,
  QuizIdReturn,
  TokenReturn,
  ErrorObject
} from '../types';

import {
  requestAuthRegister,
  requestQuizCreate,
  requestQuizInfo,
  requestClear,
  requestQuizDescriptionUpdate,
  requestQuizRemove,
  requestQuizList,
  requestQuizNameUpdate,
  requestLogout
} from './wrapper';

import {
  Quiz,
} from '../dataStore';

const ERROR = expect.any(String);

beforeEach(() => {
  requestClear();
});

describe('POST /v1/admin/auth/logout', () => {
  let errorReturn: ErrorObject;
  let userToken: TokenReturn;
  describe('Success Cases', () => {
    userToken = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    expect(requestLogout(userToken.token)).toEqual({});
  });

  describe('Error Cases', () => {
    errorReturn = requestLogout('');
    expect(errorReturn.error).toEqual(ERROR);
    expect(errorReturn.statusCode).toEqual(401);
  });
});
