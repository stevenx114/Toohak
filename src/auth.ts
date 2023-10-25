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
  getUser,
  ErrorObject,
  TokenReturn,
  UserDetailsReturn
} from './types';

/**
* Register a user with an email, password, and names, then returns their authUserId value.
*
* @param {string} email
* @param {number} password
* @param {string} nameFirst
* @param {string} nameLast
* @returns {object} token
* @returns {string} error
*/
export const adminAuthRegister = (email: string, password: string, nameFirst: string, nameLast: string): TokenReturn | ErrorObject => {
  const data = getData();
  const newUserId = parseInt(generateCustomUuid("0123456789", 12));
  const sessionId = generateCustomUuid("0123456789", 12);
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
  }

  if (data.users.some(user => user.email === email)) {
    return {
      error: 'Email address is used by another user'
    };
  } else if (!validator.isEmail(email)) {
    return {
      error: 'Email address is invalid'
    };
  } else if (!allowedNameChars.test(nameFirst)) {
    return {
      error: 'First name contains forbidden characters'
    };
  } else if (nameFirst.length < 2 || nameFirst.length > 20) {
    return {
      error: 'First name must be between 2 and 20 characters long'
    };
  } else if (!allowedNameChars.test(nameLast)) {
    return {
      error: 'Last name contains forbidden characters'
    };
  } else if (nameLast.length < 2 || nameLast.length > 20) {
    return {
      error: 'Last name must be between 2 and 20 characters long'
    };
  } else if (password.length < 8) {
    return {
      error: 'Password needs to be 8 characters or longer'
    };
  } else if (!((/[a-z]/.test(password) || /[A-Z]/.test(password)) &&
                /[0-9]/.test(password))) {
    return {
      error: 'Password must contain at least one number and at least one letter'
    };
  }

  data.users.push(newUser);
  data.tokens.push(newToken)
  setData(data);

  return {
    token: newToken.sessionId
  };
};

/**
 * Given a registered user's email and password returns their authUserId value.
 *
 * @param {string} email
 * @param {string} password
 * @returns {object} authUserId
 */
export const adminAuthLogin = (email: string, password: string): TokenReturn | ErrorObject => {
  const data = getData();
  if (!data.users.some(user => user.email === email)) {
    return {
      error: 'Email address does not exist'
    };
  }
  // Finds the user given their email
  const currUser = data.users.find(user => user.email === email);
  // Checks if the password matches the user's set password
  if (password !== currUser.password) {
    currUser.numFailedPasswordsSinceLastLogin += 1;
    return {
      error: 'Password is not correct for the given email'
    };
  }
  currUser.numFailedPasswordsSinceLastLogin = 0;
  currUser.numSuccessfulLogins += 1;
  const newToken = {
    sessionId: generateCustomUuid("0123456789", 12),
    authUserId: currUser.userId
  }
  data.tokens.push(newToken);
  setData(data);
  return {
    token: newToken.sessionId
  };
};

/**
 * Given an admin user's authUserId, return details about the user.
 * "name" is the first and last name concatenated with a single space between them
 *
 * @param {number} // authUserId
 * @returns {object} // user details
 */
export const adminUserDetails = (authUserId: number): UserDetailsReturn | ErrorObject => {
  const user = getUser(authUserId);
  if (!user) {
    return { error: 'AuthUserId is not a valid user' };
  }

  return {
    user: {
      userId: user.userId,
      name: user.name,
      email: user.email,
      numSuccessfulLogins: user.numSuccessfulLogins,
      numFailedPasswordsSinceLastLogin: user.numFailedPasswordsSinceLastLogin,
    }
  };
};
