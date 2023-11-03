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
  EmptyObject,
  TokenReturn,
  UserDetailsReturn,
  getToken,
  getUser,
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
    previousPasswords: [password]
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
    return {
      error: 'Email address does not exist',
      statusCode: 400,
    };
  }
  // Finds the user given their email
  const currUser = data.users.find(user => user.email === email);
  // Checks if the password matches the user's set password
  if (password !== currUser.password) {
    currUser.numFailedPasswordsSinceLastLogin += 1;
    return {
      error: 'Password is not correct for the given email',
      statusCode: 400,
    };
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
    return {
      error: 'Token does not refer to valid logged in user session',
      statusCode: 401,
    };
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
    return {
      error: 'Token does not refer to valid logged in user session',
      statusCode: 401,
    };
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
    return {
      error: 'Token does not refer to valid logged in user session',
      statusCode: 401,
    };
  }
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
      error: 'NameLast contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes',
      statusCode: 400
    };
  } else if (nameLast.length < 2 || nameLast.length > 20) {
    return {
      error: 'NameLast is less than 2 characters or more than 20 characters',
      statusCode: 400
    };
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
  if (!curToken) {
    return {
      error: 'Token does not refer to a valid logged in user session',
      statusCode: 401
    };
  }
  const curUser = getUser(curToken.authUserId);
  if (oldPassword !== curUser.password) {
    return {
      error: 'Old password is not the correct old password',
      statusCode: 400
    };
  } else if (oldPassword === newPassword) {
    return {
      error: 'Old Password and New Password match exactly',
      statusCode: 400
    };
  } else if (curUser.previousPasswords.includes(newPassword)) {
    return {
      error: 'New Password has already been used before by this user',
      statusCode: 400
    };
  } else if (newPassword.length < 8) {
    return {
      error: 'New Password is less than 8 characters',
      statusCode: 400
    };
  } else if ((!/[a-z]/.test(newPassword) && !/[A-Z]/.test(newPassword))) {
    return {
      error: 'New Password does not contain at least one letter',
      statusCode: 400
    };
  } else if (!/\d/.test(newPassword)) {
    return {
      error: 'New Password does not contain at least one number',
      statusCode: 400
    };
  }
  curUser.password = newPassword;
  curUser.previousPasswords.push(oldPassword);
  setData(data);
  return {};
};
