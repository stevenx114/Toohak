import request from 'sync-request-curl';
import config from '../config.json';

const port = config.port;
const url = config.url;

const SERVER_URL = `${url}:${port}`;

// Wrapper for adminQuizNameUpdate
export function requestQuizNameUpdate(token: string, quizid: number, name: string) {
  const res = request('PUT', SERVER_URL + '/v1/admin/quiz/' + quizid + '/name', {
    json: { token: token, quizid: quizid, name: name }
  });
  return JSON.parse(res.body.toString());
}
