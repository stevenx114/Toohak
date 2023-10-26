import request from 'sync-request-curl';
import config from '../config.json';

const port = config.port;
const url = config.url;

const SERVER_URL = `${url}:${port}`;

export function requestAdminUpdateUserPassword(sessionId: string, oldPassword: string, newPassword: string) {
  const res = request('PUT', SERVER_URL + '/v1/admin/user/password', {
    json: { sessionId: sessionId, oldPassword: oldPassword, newPassword: newPassword }
  });
  return JSON.parse(res.body.toString());
}