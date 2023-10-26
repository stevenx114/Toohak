import {
  validDetails,
  QuizIdReturn,
  TokenReturn,
  ErrorObject
} from '../types';

import {
  requestAuthRegister,
  requestQuizCreate,
  requestQuizInfo,
  requestClear,
  requestQuizDescriptionUpdate,
  requestQuizRemove,
  requestQuizList,
  requestQuizNameUpdate,
  requestLogout
} from './wrapper';

import {
  Quiz,
} from '../dataStore';

const ERROR = expect.any(String);

beforeEach(() => {
  requestClear();
});

describe('PUT /v1/admin/quiz/{quizid}/question/{questionId}/move', () => {
  
  describe('Success Cases', () => {

  });

  describe('Error Cases', () => {
    
  });
});