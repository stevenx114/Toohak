import request from 'sync-request-curl';
import config from '../config.json';

const port = config.port;
const url = config.url;

const SERVER_URL = `${url}:${port}`;

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
    json: { email: email, password: password }
  });
  return JSON.parse(res.body.toString());
}

// Wrapper for adminUserDetails
export function requestUserDetails(token: string) {
  const res = request('GET', SERVER_URL + '/v1/admin/user/details', {
    qs: { token: token }
  });
  return JSON.parse(res.body.toString());
}

// Wrapper for adminQuizInfo
export function requestQuizInfo(token: string, quizid: number) {
  const res = request('GET', SERVER_URL + '/v1/admin/quiz/' + quizid, {
    qs: { token: token }
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
export function requestQuizRemove(token: string, quizid: number) {
  const res = request('DELETE', SERVER_URL + '/v1/admin/quiz/' + quizid, {
    qs: { token: token }
  });
  return JSON.parse(res.body.toString());
}

// Wrapper for adminQuizCreate
export function requestQuizCreate(token: string, name: string, description: string) {
  const res = request('POST', SERVER_URL + '/v1/admin/quiz', {
    json: { token: token, name: name, description: description }
  });
  return JSON.parse(res.body.toString());
}

// Wrapper for adminQuizNameUpdate
export function requestQuizNameUpdate(token: string, quizid: number, name: string) {
  const res = request('PUT', SERVER_URL + '/v1/admin/quiz/' + quizid + '/name', {
    json: { token: token, name: name }
  });
  return JSON.parse(res.body.toString());
}

// Wrapper for adminQuizDescriptionUpdate
export function requestQuizDescriptionUpdate(token: string, quizid: number, description: string) {
  const res = request('PUT', SERVER_URL + '/v1/admin/quiz/' + quizid + '/description', {
    json: { token: token, description: description }
  });
  return JSON.parse(res.body.toString());
}

// Wrapper for clear
export function requestClear() {
  const res = request('DELETE', SERVER_URL + '/v1/clear', {
    qs: { }
  });
  return JSON.parse(res.body.toString());
}

// Wrapper for adminAuthLogout
export function requestLogout(token: string) {
  const res = request('POST', SERVER_URL + '/v1/admin/auth/logout', {
    json: { token: token }
  });
  return JSON.parse(res.body.toString());
}

// Wrapper for trashview
export function requestTrashView(token: string) {
  const res = request('GET', SERVER_URL + '/v1/admin/quiz/trash', {
    qs: { token: token }
  });
  return JSON.parse(res.body.toString());
}
