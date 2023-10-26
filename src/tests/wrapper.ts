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

// Wrapper for clear
export function requestClear() {
  const res = request('DELETE', SERVER_URL + '/v1/clear', {
    qs: { }
  });
  return JSON.parse(res.body.toString());
}

// Wrapper for adminQuizQuestionMove
export function requestQuizQuestionMove(token: string, quizId: number, questionId: number, newPosition: number) {
  const res = request('PUT', SERVER_URL + '/v1/admin/quiz/' + quizId + '/question' + questionId + '/move', {
    json: { token: token, newPosition: newPosition }
  });
  return JSON.parse(res.body.toString());
}
