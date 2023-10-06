import {
  clear,
} from './other';

import {
  adminAuthRegister,
  adminUserDetails,
} from './auth';

import {
  adminQuizList,
  adminQuizCreate,
} from './quiz';
  
const ERROR = { error: expect.any(String) };
  
describe('Clear Function implementation', () => {
  let authUserId;
  let quizId;
  
  beforeEach(() => {
    authUserId = adminAuthRegister('sample@gmail.com', 'samplepassword1', 'firstname', 'lastname');
    quizId = adminQuizCreate(authUserId.userId, 'quizName', 'description');
  });
  
  test('Returns empty dictionary', () => {

    expect(clear()).toStrictEqual({});
    
  });

  test('Removing user data', () => {

    expect(clear()).toStrictEqual({});
    expect(adminUserDetails(authUserId.userId)).toStrictEqual(ERROR);

  });

  test('Removing quiz data', ()=> {

    expect(clear()).toStrictEqual({});
    authUserId = adminAuthRegister('sample@gmail.com', 'samplepassword1', 'firstname', 'lastname');
    expect(adminQuizList(authUserId.authUserId)).toStrictEqual({quizzes: []});

  });
});

 
