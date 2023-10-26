import {
  getData,
  setData
} from './dataStore';

import {
  getToken,
  ErrorObject,
  EmptyObject
} from './types';

/**
 * Logs out an admin user who has an active session.
 *
 * @param {string} sessionId
 * @returns {object} EmptyObject | ErrorObject
 */
export const adminAuthLogout = (sessionId: string): EmptyObject | ErrorObject => {
  const data = getData();
  const curToken = getToken(sessionId);

  if (!curToken) {
    return {
      error: 'Token does not refer to valid logged in user session',
      statusCode: 401,
    };
  }

  const indexOfToken = data.tokens.indexOf(curToken);
  data.tokens.splice(indexOfToken, 1);
  setData(data);

  return {};
};
