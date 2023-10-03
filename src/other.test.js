
import {
    clear,
} from './other';

import {
  adminAuthRegister,
  adminUserDetails,
  adminQuizList,
  adminQuizCreate,
} from './auth';
  
const ERROR = { error: expect.any(String) };
  
describe('Clear Function implementation', () => {

  let authUserId;
  let quizId;
  
  beforeEach(() => {
    authUserId = adminAuthRegister('sample@gmail.com', 'samplepassword1', 'firstname', 'lastname');
    quizId = adminQuizCreate(authUserId, 'quizName', 'description');
  });

  test('Removing user data', () => {

    clear();

    expect(adminUserDetails(authUserId)).toStrictEqual(ERROR);

  });

  test('Removing quiz data', ()=> {

    clear();

    expect(adminQuizList(authUserId)).toStrictEqual(ERROR);

  });


  test('removing both user and quiz data', ()=> {

    clear();

    expect(adminUserDetails(authUserId)).toStrictEqual(ERROR);

    expect(adminQuizList(authUserId)).toStrictEqual(ERROR);

  });


});

 