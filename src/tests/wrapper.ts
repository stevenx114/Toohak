import request from 'sync-request-curl';
import config from '../config.json';

const port = config.port;
const url = config.url;

const SERVER_URL = `${url}:${port}`;

// Wrapper for adminQuizCreate
export function requestQuizCreate(token: string, name: string, description: string) {
  const res = request('POST', SERVER_URL + '/v1/admin/quiz', {
      json: { token: token, name: name, description: description } 
  });
  return JSON.parse(res.body.toString());
 
}

// Wrapper for adminQuizList
export function requestQuizList(token: string) {
  const res = request('GET', SERVER_URL + '/v1/admin/quiz/list', {
    qs: { token: token }
  });
  return JSON.parse(res.body.toString());
}

// Wrapper for adminQuizRemove
export function requestQuizRemove(quizid: number, token: string) {
  const res = request('DELETE', SERVER_URL + '/v1/admin/quiz/' + quizid, {
    qs: { token: token }
  });
  return JSON.parse(res.body.toString());
}

// Wrapper for adminQuizDescriptionUpdate
export function requestQuizDescriptionUpdate(quizid: number, token: string, description: string) {
  const res = request('PUT', SERVER_URL + '/v1/admin/quiz/' + quizid + '/description', {
    json: { token: token, description: description }
  });
  return JSON.parse(res.body.toString());
}

// Wrapper for adminQuizNameUpdate
export function requestQuizNameUpdate(quizid: number, token: string, name: string) {
  const res = request('PUT', SERVER_URL + '/v1/admin/quiz/' + quizid + '/name', {
    json: { token: token, name: name }
  });
  return JSON.parse(res.body.toString());
}

// Wrapper for adminQuizInfo
export function requestQuizInfo(quizid: number, token: string) {
  const res = request('GET', SERVER_URL + '/v1/admin/quiz/' + quizid, {
    qs: { token: token }
  });
  return JSON.parse(res.body.toString());
}

// Wrapper for adminAuthRegister
export function requestAuthRegister(email: string, password: string, nameFirst: string, nameLast: string) {
  const res = request('POST', SERVER_URL + '/v1/admin/auth/register', {
    json: { email: email, password: password, nameFirst: nameFirst, nameLast: nameLast }
  });
  return JSON.parse(res.body.toString());
}

// Wrapper for adminAuthLogin
export function requestAuthLogin(email: string, password: string) {
  const res = request('POST', SERVER_URL + '/v1/admin/auth/login', {
    json: { token: token }
  });
  return JSON.parse(res.body.toString());
}

// Wrapper for adminUserDetails
export function requestUserDetails(token: string) {
  const res = request('GET', SERVER_URL + '/v1/admin/user/details', {
    qs: { user: {
      userId: user.userId,
      name: user.name,
      email: user.email,
      numSuccessfulLogins: user.numSuccessfulLogins,
      numFailedPasswordsSinceLastLogin: user.numFailedPasswordsSinceLastLogin,
    }}
  });
  return JSON.parse(res.body.toString());
}


// Wrapper for clear
export function requestClear() {
  const res = request('DELETE', SERVER_URL + '/v1/clear', {
    qs: { token: token }
  });
  return JSON.parse(res.body.toString());
}