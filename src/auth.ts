import {
  getData,
  setData,
  Token,
  User
} from './dataStore';

import {
  getToken,
  getUser,
  getHashOf
} from './helper';

import {
  generateCustomUuid
} from 'custom-uuid';

import validator from 'validator';

import HTTPError from 'http-errors';

import {
  ErrorObject,
  EmptyObject,
  TokenReturn,
  UserDetailsReturn,
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
    password: getHashOf(password),
    numSuccessfulLogins: 1,
    numFailedPasswordsSinceLastLogin: 0,
    quizzesOwned: [],
    previousPasswords: [password]
  };
  const newToken: Token = {
    sessionId: sessionId,
    authUserId: newUserId
  };

  if (data.users.some(user => user.email === email)) {
    throw HTTPError(400, 'Email address is used by another user');
  } else if (!validator.isEmail(email)) {
    throw HTTPError(400, 'Email address is invalid');
  } else if (!allowedNameChars.test(nameFirst)) {
    throw HTTPError(400, 'First name contains forbidden characters');
  } else if (nameFirst.length < 2 || nameFirst.length > 20) {
    throw HTTPError(400, 'First name must be between 2 and 20 characters long');
  } else if (!allowedNameChars.test(nameLast)) {
    throw HTTPError(400, 'Last name contains forbidden characters');
  } else if (nameLast.length < 2 || nameLast.length > 20) {
    throw HTTPError(400, 'Last name must be between 2 and 20 characters long');
  } else if (password.length < 8) {
    throw HTTPError(400, 'Password needs to be 8 characters or longer');
  } else if (!((/[a-z]/.test(password) || /[A-Z]/.test(password)) && /[0-9]/.test(password))) {
    throw HTTPError(400, 'Password must contain at least one number and at least one letter');
  }

  data.users.push(newUser);
  data.tokens.push(newToken);
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
 * @returns {object} TokenReturn | ErrorObject
 */
export const adminAuthLogin = (email: string, password: string): TokenReturn | ErrorObject => {
  const data = getData();
  if (!data.users.some(user => user.email === email)) {
    throw HTTPError(400, 'Email address does not exist');
  }
  // Finds the user given their email
  const currUser = data.users.find(user => user.email === email);
  // Checks if the password matches the user's set password
  if (getHashOf(password) !== currUser.password) {
    currUser.numFailedPasswordsSinceLastLogin += 1;
    throw HTTPError(400, 'Password is not correct for the given email');
  }
  currUser.numFailedPasswordsSinceLastLogin = 0;
  currUser.numSuccessfulLogins += 1;
  const newToken = {
    sessionId: generateCustomUuid('0123456789', 12),
    authUserId: currUser.userId
  };
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
 * @param {Object} // userToken
 * @returns {object} // UserdetailsReturn | ErrorObject
 */
export const adminUserDetails = (token: string): UserDetailsReturn | ErrorObject => {
  const curToken = getToken(token);

  if (!curToken) {
    throw HTTPError(401, 'Token does not refer to valid logged in user session');
  }
  const curUserId = curToken.authUserId;
  const curUser = getUser(curUserId);

  return {
    user: {
      userId: curUser.userId,
      name: curUser.name,
      email: curUser.email,
      numSuccessfulLogins: curUser.numSuccessfulLogins,
      numFailedPasswordsSinceLastLogin: curUser.numFailedPasswordsSinceLastLogin,
    }
  };
};

/**
 * Logs out an admin user who has an active session.
 *
 * @param {string} token
 * @returns {object} EmptyObject | ErrorObject
 */
export const adminAuthLogout = (token: string): EmptyObject | ErrorObject => {
  const data = getData();
  const curToken = getToken(token);

  if (!curToken) {
    throw HTTPError(401, 'Token does not refer to valid logged in user session');
  }

  const indexOfToken = data.tokens.indexOf(curToken);
  data.tokens.splice(indexOfToken, 1);
  setData(data);

  return {};
};

/**
 *
 * @param {string} token
 * @param {string} email
 * @param {string} nameFirst
 * @param {string} nameLast
 * @returns {object} EmptyObject | ErrorObject
 */
export const adminUserDetailsUpdate = (token: string, email: string, nameFirst: string, nameLast: string): EmptyObject | ErrorObject => {
  const data = getData();
  const curToken = getToken(token);
  const allowedNameChars = /^[a-zA-Z '-]+$/;

  if (!curToken) {
    throw HTTPError(401, 'Token does not refer to valid logged in user session');
  } else if (data.users.some(user => user.email === email)) {
    throw HTTPError(400, 'Email address is used by another user');
  } else if (!validator.isEmail(email)) {
    throw HTTPError(400, 'Email address is invalid');
  } else if (!allowedNameChars.test(nameFirst)) {
    throw HTTPError(400, 'First name contains forbidden characters');
  } else if (nameFirst.length < 2 || nameFirst.length > 20) {
    throw HTTPError(400, 'First name must be between 2 and 20 characters long');
  } else if (!allowedNameChars.test(nameLast)) {
    throw HTTPError(400, 'Last name contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes');
  } else if (nameLast.length < 2 || nameLast.length > 20) {
    throw HTTPError(400, 'Last name is less than 2 characters or more than 20 characters');
  }

  const curUser = getUser(curToken.authUserId);

  curUser.email = email;
  curUser.name = `${nameFirst} ${nameLast}`;
  setData(data);
  return {};
};

/**
 * Given details relating to a password change, update the password of a logged in user.
 *
 * @param {string} sessionId
 * @param {string} oldPassword
 * @param {string} newPassword
 * @returns {object} EmptyObject | ErrorObject
 */
export const adminUpdateUserPassword = (sessionId: string, oldPassword: string, newPassword: string): ErrorObject | EmptyObject => {
  const data = getData();
  const curToken = getToken(sessionId);
  const hashedNewPassword = getHashOf(newPassword);
  const hashedOldPassword = getHashOf(oldPassword);
  if (!curToken) {
    throw HTTPError(401, 'Token does not refer to a valid logged in user session');
  }
  const curUser = getUser(curToken.authUserId);
  if (hashedOldPassword !== curUser.password) {
    throw HTTPError(400, 'Old password is not the correct old password');
  } else if (hashedOldPassword === hashedNewPassword) {
    throw HTTPError(400, 'Old Password and New Password match exactly');
  } else if (curUser.previousPasswords.includes(hashedNewPassword)) {
    throw HTTPError(400, 'New Password has already been used before by this user');
  } else if (newPassword.length < 8) {
    throw HTTPError(400, 'New Password is less than 8 characters');
  } else if ((!/[a-z]/.test(newPassword) && !/[A-Z]/.test(newPassword))) {
    throw HTTPError(400, 'New Password does not contain at least one letter');
  } else if (!/\d/.test(newPassword)) {
    throw HTTPError(400, 'New Password does not contain at least one number');
  }
  curUser.password = hashedNewPassword;
  curUser.previousPasswords.push(hashedOldPassword);
  setData(data);
  return {};
};
