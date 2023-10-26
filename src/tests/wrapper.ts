import request from 'sync-request-curl';
import config from '../config.json';

const port = config.port;
const url = config.url;

const SERVER_URL = `${url}:${port}`;

// Wrapper for adminAuthLogout
export function requestAuthLogout(token: string) {
  const res = request('POST', SERVER_URL + '/v1/admin/auth/logout', {
    json: { token: token }
  });
  return JSON.parse(res.body.toString());
}