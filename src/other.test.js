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
  
  beforeEach(() => {
    authUserId = adminAuthRegister('sample@gmail.com', 'samplepassword1', 'firstname', 'lastname');
    adminQuizCreate(authUserId.authUserId, 'quizName', 'description');
  });
  
  test('Returns empty dictionary', () => {

    expect(clear()).toStrictEqual({});
    
  });

  test('Removing user data', () => {

    expect(clear()).toStrictEqual({});
    expect(adminUserDetails(authUserId.authUserId)).toStrictEqual(ERROR);

  });

  test('Removing quiz data', ()=> {

    expect(clear()).toStrictEqual({});
    authUserId = adminAuthRegister('sample@gmail.com', 'samplepassword1', 'firstname', 'lastname');
    expect(adminQuizList(authUserId.authUserId)).toStrictEqual({quizzes: []});

  });
});

 
