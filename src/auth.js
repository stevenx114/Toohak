import { getData, setData } from './dataStore.js' 

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

// Register a user with an email, password, and names, then returns their authUserId value.
function adminAuthRegister(email, password, nameFirst, nameLast) {
    return {
        authUserId: 1,
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

    return { user:
        {
          userId: user.userId,
          name: user.name,
          email: user.email,
          numSuccessfulLogins: user.numSuccessfulLogins,
          numFailedPasswordsSinceLastLogin: user.numFailedPasswordsSinceLastLogin,
        }
    }

}
