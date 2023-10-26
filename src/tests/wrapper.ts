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
  return {
    body: JSON.parse(res.body.toString()),
    statusCode: res.statusCode,
  }
}

// Wrapper for adminAuthLogin
export function requestAuthLogin(email: string, password: string) {
  const res = request('POST', SERVER_URL + '/v1/admin/auth/login', {
    json: { email: email, password: password }
  });
  return {
    body: JSON.parse(res.body.toString()),
    statusCode: res.statusCode,
  }
}

// Wrapper for adminUserDetails
export function requestUserDetails(token: string) {
  const res = request('GET', SERVER_URL + '/v1/admin/user/details', {
    qs: { token: token }
  });
  return {
    body: JSON.parse(res.body.toString()),
    statusCode: res.statusCode,
  }
}

// Wrapper for adminQuizCreate
export function requestQuizCreate(token: string, name: string, description: string) {
  const res = request('POST', SERVER_URL + '/v1/admin/quiz', {
    json: { token: token, name: name, description: description } 
  });
  return {
    body: JSON.parse(res.body.toString()),
    statusCode: res.statusCode,
  }
 
}

// Wrapper for adminQuizList
export function requestQuizList(token: string) {
  const res = request('GET', SERVER_URL + '/v1/admin/quiz/list', {
    qs: { token: token }
  });
  return {
    body: JSON.parse(res.body.toString()),
    statusCode: res.statusCode,
  }
}

// Wrapper for adminQuizRemove
export function requestQuizRemove(token: string, quizid: number) {
  const res = request('DELETE', SERVER_URL + '/v1/admin/quiz/' + quizid, {
    qs: { token: token, quizid: quizid }
  });
  return {
    body: JSON.parse(res.body.toString()),
    statusCode: res.statusCode,
  }
}

// Wrapper for adminQuizDescriptionUpdate
export function requestQuizDescriptionUpdate(token: string, quizid: number, description: string) {
  const res = request('PUT', SERVER_URL + '/v1/admin/quiz/' + quizid + '/description', {
    json: { token: token, quizid: quizid, description: description }
  });
  return {
    body: JSON.parse(res.body.toString()),
    statusCode: res.statusCode,
  }
}

// Wrapper for adminQuizNameUpdate
export function requestQuizNameUpdate(token: string, quizid: number, name: string) {
  const res = request('PUT', SERVER_URL + '/v1/admin/quiz/' + quizid + '/name', {
    json: { token: token, quizid: quizid, name: name }
  });
  return {
    body: JSON.parse(res.body.toString()),
    statusCode: res.statusCode,
  }
}

// Wrapper for adminQuizInfo
export function requestQuizInfo(token: string, quizid: number) {
  const res = request('GET', SERVER_URL + '/v1/admin/quiz/' + quizid, {
    qs: { token: token, quizid: quizid }
  });
  return {
    body: JSON.parse(res.body.toString()),
    statusCode: res.statusCode,
  }
}

// Wrapper for clear
export function requestClear() {
  const res = request('DELETE', SERVER_URL + '/v1/clear', {
    qs: { }
  });
  return {
    body: JSON.parse(res.body.toString()),
    statusCode: res.statusCode,
  }
}