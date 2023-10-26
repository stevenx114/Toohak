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
    getToken,
    getUser,
    ErrorObject,
    EmptyObject,
    TokenReturn,
    UserDetailsReturn
  } from './types';

export const adminUpdateUserPassword = (sessionId: string, oldPassword: string, newPassword: string): ErrorObject | EmptyObject => {
    const data = getData();
    const curToken = getToken(sessionId);
    if (!curToken) {
        return {
            error: "Token does not refer to valid logged in user session",
            statusCode: 401
        }
    }
    const curUser = getUser(curToken.authUserId);
    if (oldPassword !== curUser.password) {
        return {
            error: "Old password is not the correct old password",
            statusCode: 400
        }
    } else if (oldPassword.localeCompare(newPassword, 'en', { sensitivity: 'base' })) {
        return {
            error: "Old Password and New Password match exactly",
            statusCode: 400
        }
    } else if (curUser.previousPasswords.includes(newPassword)) {
        return {
            error: "New Password has already been used before by this user",
            statusCode: 400
        }
    } else if (newPassword.length < 8) {
        return {
            error: "New Password is less than 8 characters",
            statusCode: 400
        }
    } else if ((!/[a-z]/.test(password) && !/[A-Z]/.test(password))) {
        return {
            error: "New Password does not contain at least one letter",
            statusCode: 400
        }
    } else if (/[0-9]/.test(password)) {
        return {
            error: "New Password does not contain at least one number", 
            statusCode: 400
        }
    }
    curUser.password = newPassword;
    curUser.previousPasswords.push(oldPassword);
    setData(data);
    return {}
}