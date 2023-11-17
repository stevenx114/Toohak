import express, { json, Request, Response } from 'express';
import { echo } from './newecho';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import errorHandler from 'middleware-http-errors';
import YAML from 'yaml';
import sui from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import process from 'process';
import {
  clear
} from './other';

import {
  adminAuthRegister,
  adminUserDetails,
  adminAuthLogin,
  adminAuthLogout,
  adminUpdateUserPassword,
  adminUserDetailsUpdate
} from './auth';

import {
  adminQuizCreate,
  adminQuizRemove,
  adminQuizInfo,
  adminQuizDescriptionUpdate,
  adminQuizNameUpdate,
  adminQuizList,
  viewQuizTrash,
  adminQuizTransfer,
  quizRestore,
  adminQuizEmptyTrash,
  adminQuizQuestionCreate,
  adminQuizQuestionMove,
  adminQuizQuestionDuplicate,
  adminUpdateQuiz,
  adminQuizQuestionDelete
} from './quiz';

import {
  adminQuizSessionStart,
  adminQuizSessionStateUpdate,
  adminQuizSessionStatusView
} from './session';

// Set up web app
const app = express();
// Use middleware that allows us to access the JSON body of requests
app.use(json());
// Use middleware that allows for access from other domains
app.use(cors());
// for logging errors (print to terminal)
app.use(morgan('dev'));
// for producing the docs that define the API
const file = fs.readFileSync(path.join(process.cwd(), 'swagger.yaml'), 'utf8');
/* istanbul ignore next */
app.get('/', (req: Request, res: Response) => res.redirect('/docs'));
/* istanbul ignore next */
app.use('/docs', sui.serve, sui.setup(YAML.parse(file), { swaggerOptions: { docExpansion: config.expandDocs ? 'full' : 'list' } }));

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || 'localhost';

// ====================================================================
//  ================= WORK IS DONE BELOW THIS LINE ===================
// ====================================================================

// Example get request
app.get('/echo', (req: Request, res: Response) => {
  const data = req.query.echo as string;
  return res.json(echo(data));
});

// adminAuthRegister
app.post('/v1/admin/auth/register', (req: Request, res: Response) => {
  const { email, password, nameFirst, nameLast } = req.body;
  res.json(adminAuthRegister(email, password, nameFirst, nameLast));
});

// adminUpdateQuiz
app.put('/v1/admin/quiz/:quizid/question/:questionid', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid as string);
  const questionId = parseInt(req.params.questionid as string);
  const { token, questionBody } = req.body;
  res.json(adminUpdateQuiz(quizId, questionId, token, questionBody));
});

// adminUpdateQuiz v2
app.put('/v2/admin/quiz/:quizid/question/:questionid', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid as string);
  const questionId = parseInt(req.params.questionid as string);
  const questionBody = req.body.questionBody;
  const token = req.headers.token;
  res.json(adminUpdateQuiz(quizId, questionId, token, questionBody));
});

// adminAuthLogin
app.post('/v1/admin/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  res.json(adminAuthLogin(email, password));
});

// adminUserDetails
app.get('/v1/admin/user/details', (req: Request, res: Response) => {
  const token = req.query.token as string;
  res.json(adminUserDetails(token));
});

// adminUserDetailsV2
app.get('/v2/admin/user/details', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  res.json(adminUserDetails(token));
});

// adminQuizList
app.get('/v1/admin/quiz/list', (req: Request, res: Response) => {
  const token = req.query.token as string;
  res.json(adminQuizList(token));
});

// adminQuizListV2
app.get('/v2/admin/quiz/list', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  res.json(adminQuizList(token));
});

// adminQuizCreate
app.post('/v1/admin/quiz', (req: Request, res: Response) => {
  const { token, name, description } = req.body;
  res.json(adminQuizCreate(token, name, description));
});

// adminQuizCreateV2
app.post('/v2/admin/quiz', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const { name, description } = req.body;
  res.json(adminQuizCreate(token, name, description));
});

// adminQuizRemove
app.delete('/v1/admin/quiz/:quizid', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const token = req.query.token as string;
  res.json(adminQuizRemove(token, quizId));
});

// adminQuizRemoveV2
app.delete('/v2/admin/quiz/:quizid', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const token = req.headers.token as string;
  res.json(adminQuizRemove(token, quizId));
});

// viewTrash
app.get('/v1/admin/quiz/trash', (req: Request, res: Response) => {
  const token = req.query.token as string;
  res.json(viewQuizTrash(token));
});

// viewTrash v2
app.get('/v2/admin/quiz/trash', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  res.json(viewQuizTrash(token));
});

// adminQuizInfo
app.get('/v1/admin/quiz/:quizid', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const token = req.query.token as string;
  res.json(adminQuizInfo(token, quizId));
});

// adminQuizInfoV2
app.get('/v2/admin/quiz/:quizid', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const token = req.headers.token as string;
  res.json(adminQuizInfo(token, quizId));
});

// adminQuizNameUpdate
app.put('/v1/admin/quiz/:quizid/name', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const { token, name } = req.body;
  res.json(adminQuizNameUpdate(token, quizId, name));
});

// adminQuizNameUpdateV2
app.put('/v2/admin/quiz/:quizid/name', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const quizId = parseInt(req.params.quizid);
  const { name } = req.body;
  res.json(adminQuizNameUpdate(token, quizId, name));
});

// adminQuizDescriptionUpdate
app.put('/v1/admin/quiz/:quizid/description', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const { token, description } = req.body;
  res.json(adminQuizDescriptionUpdate(token, quizId, description));
});

// adminQuizDescriptionUpdate v2
app.put('/v2/admin/quiz/:quizid/description', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const description = req.body.description;
  const token = req.headers.token;
  res.json(adminQuizDescriptionUpdate(token, quizId, description));
});

// clear
app.delete('/v1/clear', (req: Request, res: Response) => {
  res.json(clear());
});

// adminAuthLogout
app.post('/v1/admin/auth/logout', (req: Request, res: Response) => {
  const { token } = req.body;
  res.json(adminAuthLogout(token));
});

// adminAuthLogoutV2
app.post('/v2/admin/auth/logout', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  res.json(adminAuthLogout(token));
});

// adminUpdateUserPassword
app.put('/v1/admin/user/password', (req: Request, res: Response) => {
  const { token, oldPassword, newPassword } = req.body;
  res.json(adminUpdateUserPassword(token, oldPassword, newPassword));
});

// adminUpdateUserPassword v2
app.put('/v2/admin/user/password', (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  const token = req.headers.token as string;
  res.json(adminUpdateUserPassword(token, oldPassword, newPassword));
});

// adminUserDetailsUpdate
app.put('/v1/admin/user/details', (req: Request, res: Response) => {
  const { token, email, nameFirst, nameLast } = req.body;
  res.json(adminUserDetailsUpdate(token, email, nameFirst, nameLast));
});

// adminUserDetailsUpdateV2
app.put('/v2/admin/user/details', (req: Request, res: Response) => {
  const token = req.headers.token;
  const { email, nameFirst, nameLast } = req.body;

  res.json(adminUserDetailsUpdate(token, email, nameFirst, nameLast));
});

// quizRestore
app.post('/v1/admin/quiz/:quizid/restore', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid as string);
  const token = req.body.token;
  res.json(quizRestore(quizId, token));
});

// quizRestore v2
app.post('/v2/admin/quiz/:quizid/restore', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid as string);
  const token = req.headers.token;
  res.json(quizRestore(quizId, token));
});

// adminQuizEmptyTrash
app.delete('/v1/admin/quiz/trash/empty', (req: Request, res: Response) => {
  const token = req.query.token;
  const quizIds = req.query.quizIds;
  res.json(adminQuizEmptyTrash(token, quizIds));
});

// adminQuizEmptyTrashV2
app.delete('/v2/admin/quiz/trash/empty', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const quizIds = req.query.quizIds;
  res.json(adminQuizEmptyTrash(token, quizIds));
});

// adminQuizTransfer
app.post('/v1/admin/quiz/:quizid/transfer', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid as string);
  const { token, userEmail } = req.body;
  res.json(adminQuizTransfer(token, quizId, userEmail));
});

// adminQuizTransferV2
app.post('/v2/admin/quiz/:quizid/transfer', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid as string);
  const token = req.headers.token;
  const { userEmail } = req.body;
  res.json(adminQuizTransfer(token, quizId, userEmail));
});

// adminQuizQuestionCreate
app.post('/v1/admin/quiz/:quizid/question', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const { token, questionBody } = req.body;
  res.json(adminQuizQuestionCreate(quizId, token, questionBody));
});

// adminQuizQuestionCreateV2
app.post('/v2/admin/quiz/:quizid/question', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const token = req.headers.token as string;
  const { questionBody } = req.body;
  res.json(adminQuizQuestionCreate(quizId, token, questionBody));
});

// adminQuizQuestionDelete
app.delete('/v1/admin/quiz/:quizid/question/:questionid', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const token = req.query.token as string;
  const questionId = parseInt(req.params.questionid);
  res.json(adminQuizQuestionDelete(quizId, questionId, token));
});

// adminQuizQuestionDeleteV2
app.delete('/v2/admin/quiz/:quizid/question/:questionid', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const token = req.headers.token as string;
  const questionId = parseInt(req.params.questionid);
  res.json(adminQuizQuestionDelete(quizId, questionId, token));
});

// adminQuizQuestionMove
app.put('/v1/admin/quiz/:quizid/question/:questionid/move', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  const { token, newPosition } = req.body;
  res.json(adminQuizQuestionMove(token, quizId, questionId, newPosition));
});

// adminQuizQuestionMoveV2
app.put('/v2/admin/quiz/:quizid/question/:questionid/move', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  const { newPosition } = req.body;
  res.json(adminQuizQuestionMove(token, quizId, questionId, newPosition));
});

// adminQuizQuestionDuplicate
app.post('/v1/admin/quiz/:quizid/question/:questionid/duplicate', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  const { token } = req.body;
  res.json(adminQuizQuestionDuplicate(token, quizId, questionId));
});

// adminQuizQuestionDuplicateV2
app.post('/v2/admin/quiz/:quizid/question/:questionid/duplicate', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  res.json(adminQuizQuestionDuplicate(token, quizId, questionId));
});

// adminQuizSessionStart
app.post('/v1/admin/quiz/:quizid/session/start', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const quizId = parseInt(req.params.quizid);
  const { autoStartNum } = req.body;
  res.json(adminQuizSessionStart(token, quizId, autoStartNum));
});

// adminQuizSessionViewV2
app.get('/v1/admin/quiz/:quizid/session/:sessionid', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const sessionId = parseInt(req.params.sessionid);
  const quizId = parseInt(req.params.quizid);
  res.json(adminQuizSessionStatusView(token, quizId, sessionId));
});

// adminQuizSessionStateUpdate
app.put('/v1/admin/quiz/:quizid/session/:sessionid', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const quizId = parseInt(req.params.quizid);
  const sessionId = parseInt(req.params.sessionid);
  const { action } = req.body;
  res.json(adminQuizSessionStateUpdate(token, quizId, sessionId, action));
});

// ====================================================================
//  ================= WORK IS DONE ABOVE THIS LINE ===================
// ====================================================================

app.use((req: Request, res: Response) => {
  const error = `
    404 Not found - This could be because:
      0. You have defined routes below (not above) this middleware in server.ts
      1. You have not implemented the route ${req.method} ${req.path}
      2. There is a typo in either your test or server, e.g. /posts/list in one
         and, incorrectly, /post/list in the other
      3. You are using ts-node (instead of ts-node-dev) to start your server and
         have forgotten to manually restart to load the new changes
      4. You've forgotten a leading slash (/), e.g. you have posts/list instead
         of /posts/list in your server.ts or test file
  `;
  res.status(404).json({ error });
});

// For handling errors
app.use(errorHandler());

// start server
const server = app.listen(PORT, HOST, () => {
  // DO NOT CHANGE THIS LINE
  console.log(`⚡️ Server started on port ${PORT} at ${HOST}`);
});

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});
