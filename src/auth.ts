import {
  getData,
  setData,
  Token,
  User
} from './dataStore';

import {
  generateCustomUuid
} from 'custom-uuid';

import validator from 'validator';

import {
  ErrorObject,
  TokenReturn
} from './types';

/**
  * Register a user with an email, password, and names, then returns their authUserId value.
  *
  * @param {string} email
  * @param {number} password
  * @param {string} nameFirst
  * @param {string} nameLast
  * @returns {object} token
  */
export const adminAuthRegister = (email: string, password: string, nameFirst: string, nameLast: string): TokenReturn | ErrorObject => {
  const data = getData();
  const newUserId = parseInt(generateCustomUuid('0123456789', 12));
  const sessionId = generateCustomUuid('0123456789', 12);
  const allowedNameChars = /^[a-zA-Z '-]+$/;
  const newUser: User = {
    userId: newUserId,
    name: `${nameFirst} ${nameLast}`,
    email: email,
    password: password,
    numSuccessfulLogins: 1,
    numFailedPasswordsSinceLastLogin: 0,
    quizzesOwned: [],
  };
  const newToken: Token = {
    sessionId: sessionId,
    authUserId: newUserId
  };

  if (data.users.some(user => user.email === email)) {
    return {
      error: 'Email address is used by another user',
      statusCode: 400
    };
  } else if (!validator.isEmail(email)) {
    return {
      error: 'Email address is invalid',
      statusCode: 400
    };
  } else if (!allowedNameChars.test(nameFirst)) {
    return {
      error: 'First name contains forbidden characters',
      statusCode: 400
    };
  } else if (nameFirst.length < 2 || nameFirst.length > 20) {
    return {
      error: 'First name must be between 2 and 20 characters long',
      statusCode: 400
    };
  } else if (!allowedNameChars.test(nameLast)) {
    return {
      error: 'Last name contains forbidden characters',
      statusCode: 400
    };
  } else if (nameLast.length < 2 || nameLast.length > 20) {
    return {
      error: 'Last name must be between 2 and 20 characters long',
      statusCode: 400
    };
  } else if (password.length < 8) {
    return {
      error: 'Password needs to be 8 characters or longer',
      statusCode: 400
    };
  } else if (!((/[a-z]/.test(password) || /[A-Z]/.test(password)) &&
                  /[0-9]/.test(password))) {
    return {
      error: 'Password must contain at least one number and at least one letter',
      statusCode: 400
    };
  }

  data.users.push(newUser);
  data.tokens.push(newToken);
  setData(data);
  return {
    token: newToken.sessionId
  };
};
