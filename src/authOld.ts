import {
  getData,
  setData,
  User
} from './dataStore';

import {
  v4 as uuidv4
} from 'uuid';

import validator from 'validator';

import {
  getUser,
  ErrorObject,
  AuthUserIdReturn,
  UserDetailsReturn
} from './types';

/**
* Register a user with an email, password, and names, then returns their authUserId value.
*
* @param {string} email
* @param {number} password
* @param {string} nameFirst
* @param {string} nameLast
* @returns {object} authUserId
* @returns {string} error
*/
export const adminAuthRegister = (email: string, password: string, nameFirst: string, nameLast: string): AuthUserIdReturn | ErrorObject => {
  const data = getData();
  const newUserId = parseInt(uuidv4().replace(/-/g, ''), 16);
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
  setData(data);

  return {
    authUserId: newUserId
  };
};

/**
 * Given a registered user's email and password returns their authUserId value.
 *
 * @param {string} email
 * @param {string} password
 * @returns {object} authUserId
 */
export const adminAuthLogin = (email: string, password: string): AuthUserIdReturn | ErrorObject => {
  const data = getData();
  if (!data.users.some(user => user.email === email)) {
    return {
      error: 'Email address does not exist'
    };
  }
  // Finds the user given their email
  let indexOfUser: number;
  for (const user in data.users) {
    if (data.users[user].email === email) {
      indexOfUser = parseInt(user);
    }
  }
  // Checks if the password matches the user's set password
  if (password !== data.users[indexOfUser].password) {
    data.users[indexOfUser].numFailedPasswordsSinceLastLogin += 1;
    return {
      error: 'Password is not correct for the given email'
    };
  }
  data.users[indexOfUser].numFailedPasswordsSinceLastLogin = 0;
  data.users[indexOfUser].numSuccessfulLogins += 1;
  return {
    authUserId: data.users[indexOfUser].userId
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
