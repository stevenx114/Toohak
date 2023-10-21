import request from 'sync-request-curl';
import config from '../src/config.json';
import { MessageSend, QuestionInput } from '../src/types';

const OK = 200;
const INPUT_ERROR = 400;
const port = config.port;
const url = config.url;

const SERVER_URL = `${url}:${port}`;

// Wrapper for adminQuizCreate
export function requestQuizCreateV1(token: string, name: string, description: string) {
    return request(
        'POST',
        SERVER_URL + '/v1/admin/quiz', 
        {
            json: {
                token: token,
                name: name,
                description: description,
            }
        }
    );
}

// Wrapper for adminQuizList
export function requestQuizListV1(token: string) {
    return request(
        'GET',
        SERVER_URL + '/v1/admin/quiz/list',
        {
            qs: {
                token: token,
            }
        }
    );
}

// Wrapper for adminQuizRemove
export function requestQuizRemoveV1(quizid: number, token: string) {
    return request(
        'DELETE',
        SERVER_URL + '/v1/admin/quiz/' + quizid,
        {
            qs: {
                token: token,
            }
        }
    );
}

// Wrapper for adminQuizDescriptionUpdate
export function requestQuizDescriptionUpdateV1(quizid: number, token: string, description: string) {
    return request(
        'PUT',
        SERVER_URL + '/v1/admin/quiz/' + quizid + '/description',
        {
            json: {
                token: token,
                description: description,
            }
        }
    );
}

// Wrapper for adminQuizNameUpdate
export function requestQuizNameUpdateV1(quizid: number, token: string, name: string) {
    return request(
        'PUT',
        SERVER_URL + '/v1/admin/quiz/' + quizid + '/name',
        {
            json: {
                token: token,
                name: name,
            }
        }
    );
}

// Wrapper for adminQuizInfo
export function requestQuizInfo(quizid: number, token: string) {
    return request(
        'GET',
        SERVER_URL + '/v1/admin/quiz/' + quizid,
        {
            qs: {
                token: token,
            }
        }
    );
}

// Wrapper for adminAuthRegister
export function requestAuthRegister(email: string, password: string, nameFirst: string, nameLast: string) {
    return request(
        'POST',
        SERVER_URL + '/v1/admin/auth/register',
        {
            json: {
                email: email,
                password: password,
                nameFirst: nameFirst,
                nameLast: nameLast,
            }
        }
    );
}

// Wrapper for clear
export function requestClearV1() {
    return request(
      'DELETE',
      SERVER_URL + '/v1/clear',
      {
        json: {}
      }
    );
  }