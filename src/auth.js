import { 
    getData, 
    setData 
} from './dataStore';

import { 
    v4 as uuidv4 
} from 'uuid';

import validator from 'validator';

export function getUser(userId) {
    const data = getData();
    return data.users.find(u => u.userId === userId);
}

export function getQuiz(quizId) {
    const data = getData();
    return data.quizzes.find(q => q.quizId === quizId);
}


// Given a registered user's email and password returns their authUserId value.
function adminAuthLogin(email, password) {
    return {
        authUserId: 1,
    }
}

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
export function adminAuthRegister(email, password, nameFirst, nameLast) {
    const data = getData();
    const newUserId = parseInt(uuidv4().replace(/-/g, ''), 16);
    const allowedNameChars = /^[a-zA-Z '-]+$/;
    const newUser = {
        userId: newUserId,
        name: `${nameFirst} ${nameLast}`,
        email: email,
        password: password,
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0,
        quizzesOwned: [],
    }

    if (data.users.some(user => user.email === email)) {
        return {
            error: 'Email address is used by another user'
        }
    } else if (!validator.isEmail(email)) {
        return {
            error: 'Email address is invalid'
        }
    } else if (!allowedNameChars.test(nameFirst)) {
        return {
            error: 'First name contains forbidden characters'
        } 
    } else if (nameFirst.length < 2 || nameFirst.length > 20) {
        return {
            error: 'First name must be between 2 and 20 characters long'
        } 
    } else if (!allowedNameChars.test(nameLast)) {
        return {
            error: 'Last name contains forbidden characters'
        } 
    } else if (nameLast.length < 2 || nameLast.length > 20) {
        return {
            error: 'Last name must be between 2 and 20 characters long'
        } 
    } else if (password.length < 8) {
        return {
            error: 'Password needs to be 8 characters or longer'
        } 
    } else if (!((/[a-z]/.test(password) || /[A-Z]/.test(password)) 
                && /[0-9]/.test(password))) {
        return {
            error: 'Password must contain at least one number and at least one letter'
        } 
    }

    data.users.push(newUser);
    setData(data);

    return {
        authUserId: newUserId
    }
}


/**
 * Given an admin user's authUserId, return details about the user.
 * "name" is the first and last name concatenated with a single space between them
 * 
 * @param {number} // authUserId
 * @returns {object} // user details
 */
export function adminUserDetails(authUserId) {
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
    }

}

