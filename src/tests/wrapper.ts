import request, { HttpVerb } from 'sync-request-curl';
import { port, url } from '../config.json';
import { IncomingHttpHeaders } from 'http';
import HTTPError from 'http-errors';

const SERVER_URL = `${url}:${port}`;
const TIMEOUT_MS = 10000;

interface Payload {
  [key: string]: any;
}

import { QuestionBody } from '../types';

const requestHelper = (
  method: HttpVerb,
  path: string,
  payload: Payload,
  headers: IncomingHttpHeaders = {}
): any => {
  let qs = {};
  let json = {};
  if (['GET', 'DELETE'].includes(method.toUpperCase())) {
    qs = payload;
  } else {
    // PUT/POST
    json = payload;
  }

  const url = SERVER_URL + path;
  const res = request(method, url, { qs, json, headers, timeout: TIMEOUT_MS });

  let responseBody: any;
  try {
    responseBody = JSON.parse(res.body.toString());
  } catch (err: any) {
    if (res.statusCode === 200) {
      throw HTTPError(500,
        `Non-jsonifiable body despite code 200: '${res.body}'.\nCheck that you are not doing res.json(undefined) instead of res.json({}), e.g. in '/clear'`
      );
    }
    responseBody = { error: `Failed to parse JSON: '${err.message}'` };
  }

  const errorMessage = `[${res.statusCode}] ` + responseBody?.error || responseBody || 'No message specified!';

  // NOTE: the error is rethrown in the test below. This is useful becasuse the
  // test suite will halt (stop) if there's an error, rather than carry on and
  // potentially failing on a different expect statement without useful outputs
  switch (res.statusCode) {
    case 400: // BAD_REQUEST
    case 401: // UNAUTHORIZED
    case 403:
      throw HTTPError(res.statusCode, errorMessage);
    case 404: // NOT_FOUND
      throw HTTPError(res.statusCode, 'Cannot find \'$rver.ts have the correct path AND method');
    case 500: // INTERNAL_SERVER_ERROR
      throw HTTPError(res.statusCode, errorMessage + '\n\nHint: Your server crashed. Check the server log!\n');
    default:
      if (res.statusCode !== 200) {
        throw HTTPError(res.statusCode, errorMessage + `\n\nSorry, no idea! Look up the status code ${res.statusCode} online!\n`);
      }
  }
  return responseBody;
};

export function requestAuthRegister(email: string, password: string, nameFirst: string, nameLast: string) {
  return requestHelper('POST', '/v1/admin/auth/register', { email, password, nameFirst, nameLast });
}

export function requestAuthLogin(email: string, password: string) {
  return requestHelper('POST', '/v1/admin/auth/login', { email, password });
}

export function requestUserDetails(token: string) {
  return requestHelper('GET', '/v1/admin/user/details', { token });
}

export function requestQuizInfo(token: string, quizid: number) {
  return requestHelper('GET', `/v1/admin/quiz/${quizid}`, { token });
}

export function requestQuizList(token: string) {
  return requestHelper('GET', '/v1/admin/quiz/list', { token });
}

export function requestQuizRemove(token: string, quizid: number) {
  return requestHelper('DELETE', `/v1/admin/quiz/${quizid}`, { token });
}

export function requestQuizCreate(token: string, name: string, description: string) {
  return requestHelper('POST', '/v1/admin/quiz', { token, name, description });
}

export function requestQuizNameUpdate(token: string, quizid: number, name: string) {
  return requestHelper('PUT', `/v1/admin/quiz/${quizid}/name`, { token, name });
}

export function requestQuizDescriptionUpdate(token: string, quizid: number, description: string) {
  return requestHelper('PUT', `/v1/admin/quiz/${quizid}/description`, { token, description });
}

export function requestClear() {
  return requestHelper('DELETE', '/v1/clear', {});
}

export function requestLogout(token: string) {
  return requestHelper('POST', '/v1/admin/auth/logout', { token });
}

export function requestAdminUpdateUserPassword(token: string, oldPassword: string, newPassword: string) {
  return requestHelper('PUT', '/v1/admin/user/password', { token, oldPassword, newPassword });
}

export function requestTrashView(token: string) {
  return requestHelper('GET', '/v1/admin/quiz/trash', { token });
}

export function requestEmptyTrash(token: string, quizIds: string) {
  return requestHelper('DELETE', '/v1/admin/quiz/trash/empty', { token, quizIds });
}

export function requestQuizTransfer(token: string, quizid: number, userEmail: string) {
  return requestHelper('POST', `/v1/admin/quiz/${quizid}/transfer`, { token, userEmail });
}

export function requestQuizTransferV2(token: string, quizid: number, userEmail: string) {
  return requestHelper('POST', `/v2/admin/quiz/${quizid}/transfer`, { userEmail }, { token });
}

export function requestUserDetailsUpdate(token: string, email: string, nameFirst: string, nameLast: string) {
  return requestHelper('PUT', '/v1/admin/user/details', { token, email, nameFirst, nameLast });
}

export function requestUserDetailsUpdateV2(token: string, email: string, nameFirst: string, nameLast: string) {
  return requestHelper('PUT', '/v2/admin/user/details', { email, nameFirst, nameLast }, { token });
}

export function requestQuizRestore(quizId: number, token: string) {
  return requestHelper('POST', `/v1/admin/quiz/${quizId}/restore`, { token });
}

export function requestQuizQuestionCreate(token: string, quizid: number, questionBody: QuestionBody) {
  return requestHelper('POST', `/v1/admin/quiz/${quizid}/question`, { token, questionBody });
}

export function requestQuizQuestionDelete(token: string, quizid: number, questionid: number) {
  return requestHelper('DELETE', `/v1/admin/quiz/${quizid}/question/${questionid}`, { token });
}

export function requestQuizQuestionMove(token: string, quizId: number, questionId: number, newPosition: number) {
  return requestHelper('PUT', `/v1/admin/quiz/${quizId}/question/${questionId}/move`, { token, newPosition });
}

export function requestQuizQuestionDuplicate(token: string, quizId: number, questionId: number) {
  return requestHelper('POST', `/v1/admin/quiz/${quizId}/question/${questionId}/duplicate`, { token });
}

export function requestQuizUpdate(quizId: number, questionId: number, token: string, questionBody: QuestionBody) {
  return requestHelper('PUT', `/v1/admin/quiz/${quizId}/question/${questionId}`, { token, questionBody });
}

export function requestNonExistentRoute() {
  return requestHelper('POST', '/non-existent-route', {});
}

export function requestLogoutV2(token: string) {
  return requestHelper('POST', '/v2/admin/auth/logout', {}, { token });
}

export function requestQuizListV2(token: string) {
  return requestHelper('GET', '/v2/admin/quiz/list', {}, { token });
}

export function requestQuizCreateV2(token: string, name: string, description: string) {
  return requestHelper('POST', '/v2/admin/quiz', { name, description }, { token });
}

export function requestQuizInfoV2(token: string, quizid: number) {
  return requestHelper('GET', `/v2/admin/quiz/${quizid}`, {}, { token });
}

export function requestQuizNameUpdateV2(token: string, quizid: number, name: string) {
  return requestHelper('PUT', `/v2/admin/quiz/${quizid}/name`, { name }, { token });
}

export function requestQuizRemoveV2(token: string, quizId: number) {
  return requestHelper('DELETE', `/v2/admin/quiz/${quizId}`, {}, { token });
}

export function requestQuizDescriptionUpdateV2(token: string, quizid: number, description: string) {
  return requestHelper('PUT', `/v2/admin/quiz/${quizid}/description`, { description }, { token });
}

export function requestTrashViewV2(token: string) {
  return requestHelper('GET', '/v2/admin/quiz/trash', {}, { token });
}

export function requestQuizRestoreV2(quizId: number, token: string) {
  return requestHelper('POST', `/v2/admin/quiz/${quizId}/restore`, {}, { token });
}

<<<<<<< HEAD
export function requestplayerQuestionInfo(playerId: number, questionPosition: number) {
  return requestHelper('GET', `/v1/player/${playerId}/question/${questionPosition}`, {}, {});
=======
export function requestQuizQuestionCreateV2(token: string, quizid: number, questionBody: QuestionBody) {
  return requestHelper('POST', `/v2/admin/quiz/${quizid}/question`, { questionBody }, { token });
}

export function requestAdminUpdateUserPasswordV2(token: string, oldPassword: string, newPassword: string) {
  return requestHelper('PUT', '/v2/admin/user/password', { oldPassword, newPassword }, { token });
}

export function requestQuizUpdateV2(quizId: number, questionId: number, token: string, questionBody: QuestionBody) {
  return requestHelper('PUT', `/v2/admin/quiz/${quizId}/question/${questionId}`, { questionBody }, { token });
}

export function requestQuizQuestionDeleteV2(token: string, quizid: number, questionid: number) {
  return requestHelper('DELETE', `/v2/admin/quiz/${quizid}/question/${questionid}`, {}, { token });
}

export function requestQuizQuestionMoveV2(token: string, quizId: number, questionId: number, newPosition: number) {
  return requestHelper('PUT', `/v2/admin/quiz/${quizId}/question/${questionId}/move`, { newPosition }, { token });
}

export function requestQuizQuestionDuplicateV2(token: string, quizId: number, questionId: number) {
  return requestHelper('POST', `/v2/admin/quiz/${quizId}/question/${questionId}/duplicate`, {}, { token });
}

export function requestQuizSessionStart(token: string, quizId: number, autoStartNum: number) {
  return requestHelper('POST', `/v1/admin/quiz/${quizId}/session/start`, { autoStartNum }, { token });
}

export function requestUserDetailsV2(token: string) {
  return requestHelper('GET', '/v2/admin/user/details', { }, { token });
}

export function requestSessionStatus(token: string, quizid: number, sessionId: number) {
  return requestHelper('GET', `/v1/admin/quiz/${quizid}/session/${sessionId}`, {}, { token });
}

export function requestEmptyTrashV2(token: string, quizIds: string) {
  return requestHelper('DELETE', '/v2/admin/quiz/trash/empty', { quizIds }, { token });
}

export function requestSessionStateUpdate(token: string, quizId: number, sessionId: number, action: string) {
  return requestHelper('PUT', `/v1/admin/quiz/${quizId}/session/${sessionId}`, { action }, { token });
>>>>>>> master
}
