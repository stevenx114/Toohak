
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


  /*beforeEach(() => {
    authUserId = adminAuthRegister('sample@gmail.com', 'samplepassword1', 'firstname', 'lastname');
    quizId = adminQuizCreate(authUserId, 'quizName', 'description');
  });
  */

  test('Just checking correct return object', () => {

    expect(clear()).toStrictEqual({});

  });

  test.skip('Removing user data', () => {

    expect(clear()).toStrictEqual({});

    expect(adminUserDetails(authUserId.authUserId)).toStrictEqual(ERROR);

  });

  test.skip('Removing quiz data', ()=> {

    expect(clear()).toStrictEqual({});

    expect(adminQuizList(authUserId.authUserId)).toStrictEqual(ERROR);

  });

});

 