import {
  adminAuthRegister
} from '../auth';

import {
  adminQuizInfo,
  adminQuizCreate,
  adminQuizList,
  adminQuizNameUpdate,
  adminQuizRemove,
  adminQuizDescriptionUpdate
} from '../quiz';

import {
  clear
} from '../other';

import {
  validDetails,
  QuizIdReturn,
  AuthUserIdReturn,
  ErrorObject
} from '../types';

import {
  Quiz
} from '../dataStore';

const ERROR = { error: expect.any(String) };

describe('adminQuizDescriptionUpdate Test', () => {
  let authUserId: AuthUserIdReturn | ErrorObject;
  let quizId: QuizIdReturn | ErrorObject;

  beforeEach(() => {
    clear();
    authUserId = adminAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    if ('authUserId' in authUserId) {
      quizId = adminQuizCreate(authUserId.authUserId, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
    }
  });

  describe('Invalid Input Tests', () => {
    test('authUserId is invalid', () => {
      clear();
      if ('authUserId' in authUserId && 'quizId' in quizId) {
        expect(adminQuizDescriptionUpdate(authUserId.authUserId + 0.1, quizId.quizId, '')).toStrictEqual(ERROR);
      }
    });

    test('Invalid quizId', () => {
      clear();
      authUserId = adminAuthRegister('johnsmith@gmail.com', 'ilovecat123', 'John', 'Smith');
      if ('authUserId' in authUserId && 'quizId' in quizId) {
        expect(adminQuizInfo(authUserId.authUserId, quizId.quizId + 0.1)).toStrictEqual(ERROR);
      }
    });

    test('quizId user doesnt own', () => {
      const authUserId2 = adminAuthRegister('testing@gmail.com', 'badpassword44', 'Testing', 'testing');
      if ('authUserId' in authUserId2 && 'quizId' in quizId) {
        expect(adminQuizDescriptionUpdate(authUserId2.authUserId, quizId.quizId, '')).toStrictEqual(ERROR);
      }
    });

    test('Invalid Description', () => {
      const longDescription = 'a'.repeat(105);
      if ('authUserId' in authUserId && 'quizId' in quizId) {
        expect(adminQuizDescriptionUpdate(authUserId.authUserId, quizId.quizId, longDescription)).toStrictEqual(ERROR);
      }
    });
  });

  describe('Valid Input test', () => {
    test('All inputs are valid', () => {
      let quizInfo: Quiz | ErrorObject;
      if ('authUserId' in authUserId && 'quizId' in quizId) {
        expect(adminQuizDescriptionUpdate(authUserId.authUserId, quizId.quizId, 'newDescription')).toStrictEqual({});
        quizInfo = adminQuizInfo(authUserId.authUserId, quizId.quizId);
      }
      if ('description' in quizInfo) {
        expect(quizInfo.description).toStrictEqual('newDescription');
      }
    });

    test('All inputs are valid but description is empty string', () => {
      let quizInfo: Quiz | ErrorObject;
      if ('authUserId' in authUserId && 'quizId' in quizId) {
        expect(adminQuizDescriptionUpdate(authUserId.authUserId, quizId.quizId, '')).toStrictEqual({});
        quizInfo = adminQuizInfo(authUserId.authUserId, quizId.quizId);
      }
      if ('description' in quizInfo) {
        expect(quizInfo.description).toStrictEqual('');
      }
    });
  });
});

beforeEach(() => {
  clear();
});

// Tests for adminQuizInfo function
describe('adminQuizInfo Test', () => {
  let ownsQuizUser: AuthUserIdReturn | ErrorObject;
  let noQuizUser: AuthUserIdReturn | ErrorObject;
  let quiz: QuizIdReturn | ErrorObject;

  beforeEach(() => {
    ownsQuizUser = adminAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    noQuizUser = adminAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    if ('authUserId' in ownsQuizUser) {
      quiz = adminQuizCreate(ownsQuizUser.authUserId, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
    }
  });

  // Success cases for adminQuizInfo function
  describe('Success Cases', () => {
    test('Correct details', () => {
      if ('authUserId' in ownsQuizUser && 'quizId' in quiz) {
        expect(adminQuizInfo(ownsQuizUser.authUserId, quiz.quizId)).toStrictEqual({
          quizId: quiz.quizId,
          name: validDetails.QUIZ_NAME,
          timeCreated: expect.any(Number),
          timeLastEdited: expect.any(Number),
          description: validDetails.DESCRIPTION,
        });
      }
    });
  });

  // Error cases for adminQuizInfo function
  describe('Error cases', () => {
    test('AuthUserId is not a valid user', () => {
      clear();
      if ('authUserId' in ownsQuizUser && 'quizId' in quiz) {
        expect(adminQuizInfo(ownsQuizUser.authUserId, quiz.quizId)).toStrictEqual(ERROR);
      }
    });

    test('Quiz ID does not refer to a valid quiz', () => {
      clear();
      ownsQuizUser = adminAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
      if ('authUserId' in ownsQuizUser && 'quizId' in quiz) {
        expect(adminQuizInfo(ownsQuizUser.authUserId, quiz.quizId + 0.1)).toStrictEqual(ERROR);
      }
    });

    test('Quiz ID does not refer to a quiz that this user owns', () => {
      if ('authUserId' in noQuizUser && 'quizId' in quiz) {
        expect(adminQuizInfo(noQuizUser.authUserId, quiz.quizId)).toStrictEqual(ERROR);
      }
    });
  });
});

// Tests for AdminQuizCreate function
describe('AdminQuizCreate', () => {
  let userId: AuthUserIdReturn | ErrorObject;

  beforeEach(() => {
    userId = adminAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    if ('authUserId' in userId) {
      adminQuizCreate(userId.authUserId, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
    }
  });

  // Error cases for AdminQuizCreate function
  test('invalid authUserId', () => {
    clear();
    if ('authUserId' in userId) {
      expect(adminQuizCreate(userId.authUserId, validDetails.QUIZ_NAME, validDetails.DESCRIPTION)).toStrictEqual(ERROR);
    }
  });

  test.each([
    { name: '' }, // empty
    { name: '!23' }, // invalid char
    { name: '!*^&' }, // invalid char
    { name: 'qw' }, // < 2 chars
    { name: '12' }, // < 2 chars
    { name: 'qwerty'.repeat(6) }, // > 30 chars
  ])('invalid name input: $name', ({ name }) => {
    if ('authUserId' in userId) {
      expect(adminQuizCreate(userId.authUserId, validDetails.QUIZ_NAME, validDetails.DESCRIPTION)).toStrictEqual(ERROR);
    }
  });

  const longDescription = 'description'.repeat(10);
  test('description too long', () => {
    if ('authUserId' in userId) {
      expect(adminQuizCreate(userId.authUserId, validDetails.QUIZ_NAME, longDescription)).toStrictEqual(ERROR);
    }
  });

  test('existing quiz name', () => {
    if ('authUserId' in userId) {
      expect(adminQuizCreate(userId.authUserId, validDetails.QUIZ_NAME, validDetails.DESCRIPTION)).toStrictEqual(ERROR);
    }
  });

  // Success case for adminQuizCreate function
  test('Valid input', () => {
    if ('authUserId' in userId) {
      expect(adminQuizCreate(userId.authUserId, 'nameValid', validDetails.DESCRIPTION)).toStrictEqual({
        quizId: expect.any(Number),
      });
    }
  });

  test('Valid input, description empty', () => {
    if ('authUserId' in userId) {
      expect(adminQuizCreate(userId.authUserId, 'nameValid', '')).toStrictEqual({
        quizId: expect.any(Number),
      });
    }
  });
});

describe('Tests for adminQuizRemove', () => {
  const userOne = {
    email: 'johnsmith@gmail.com',
    password: 'ilovecat123',
    nameFirst: 'john',
    nameLast: 'smith'
  };
  const noQuizUser = {
    email: 'thomasapple@gmail.com',
    password: 'helloworld123',
    nameFirst: 'thomas',
    nameLast: 'apple'
  };
  let userIdOne: AuthUserIdReturn | ErrorObject;
  let noQuizUserId: AuthUserIdReturn | ErrorObject;
  let quizOne: QuizIdReturn | ErrorObject;
  let quizTwo: QuizIdReturn | ErrorObject;
  beforeEach(() => {
    clear();
    userIdOne = adminAuthRegister(userOne.email, userOne.password, userOne.nameFirst, userOne.nameLast);
    noQuizUserId = adminAuthRegister(noQuizUser.email, noQuizUser.password, noQuizUser.nameFirst, noQuizUser.nameLast);
    if ('authUserId' in userIdOne) {
      quizOne = adminQuizCreate(userIdOne.authUserId, 'testQuizOne', validDetails.DESCRIPTION);
      quizTwo = adminQuizCreate(userIdOne.authUserId, 'testQuizTwo', validDetails.DESCRIPTION);
    }
  });
  describe('Success cases', () => {
    test('Successful removal of quiz one', () => {
      if ('authUserId' in userIdOne && 'quizId' in quizOne && 'quizId' in quizTwo) {
        adminQuizRemove(userIdOne.authUserId, quizOne.quizId);
        expect(adminQuizList(userIdOne.authUserId)).toStrictEqual({
          quizzes: [
            {
              quizId: quizTwo.quizId,
              name: 'testQuizTwo'
            }
          ]
        });
      }
    });
    test('Successful removal of quiz two', () => {
      if ('authUserId' in userIdOne && 'quizId' in quizOne && 'quizId' in quizTwo) {
        expect(adminQuizRemove(userIdOne.authUserId, quizTwo.quizId)).toEqual({});
        expect(adminQuizList(userIdOne.authUserId)).toStrictEqual({
          quizzes: [
            {
              quizId: quizOne.quizId,
              name: 'testQuizOne'
            }
          ]
        });
      }
    });
  });
  describe('Error Cases', () => {
    test('Testing for invalid user Id', () => {
      clear();
      if ('authUserId' in userIdOne && 'quizId' in quizOne) {
        expect(adminQuizRemove(userIdOne.authUserId, quizOne.quizId)).toStrictEqual(ERROR);
      }
    });
    test('Testing for invalid quiz Id', () => {
      clear();
      userIdOne = adminAuthRegister(userOne.email, userOne.password, userOne.nameFirst, userOne.nameLast);
      if ('authUserId' in userIdOne && 'quizId' in quizOne) {
        expect(adminQuizRemove(userIdOne.authUserId, quizOne.quizId)).toStrictEqual(ERROR);
      }
    });
    test('Quiz Id does not refer to a quiz that this user owns', () => {
      if ('authUserId' in noQuizUserId && 'quizId' in quizOne) {
        expect(adminQuizRemove(noQuizUserId.authUserId, quizOne.quizId)).toStrictEqual(ERROR);
      }
    });
  });
});

// Tests for adminQuizNameUpdate function
describe('adminQuizNameUpdate', () => {
  let newUser: AuthUserIdReturn | ErrorObject;
  let newQuiz: QuizIdReturn | ErrorObject;
  beforeEach(() => {
    newUser = adminAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    if ('authUserId' in newUser) {
      newQuiz = adminQuizCreate(newUser.authUserId, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
    }
  });

  // Success cases for adminQuizNameUpdate function
  describe('Success Cases', () => {
    test('Successful implementation', () => {
      if ('authUserId' in newUser && 'quizId' in newQuiz) {
        expect(adminQuizNameUpdate(newUser.authUserId, newQuiz.quizId, 'name Updated')).toEqual({});
        const curQuiz = adminQuizInfo(newUser.authUserId, newQuiz.quizId);
        if ('name' in curQuiz) {
          expect(curQuiz.name).toEqual('name Updated');
        }
      }
    });
  });

  // Error cases for adminQuizNameUpdate function
  describe('Error cases', () => {
    test('AuthUserId is not a valid user', () => {
      clear();
      if ('authUserId' in newUser && 'quizId' in newQuiz) {
        expect(adminQuizNameUpdate(newUser.authUserId, newQuiz.quizId, 'name Updated')).toEqual(ERROR);
      }
    });

    test('Quiz ID does not refer to a valid quiz', () => {
      clear();
      newUser = adminAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
      if ('authUserId' in newUser && 'quizId' in newQuiz) {
        expect(adminQuizNameUpdate(newUser.authUserId, newQuiz.quizId, 'name Updated')).toEqual(ERROR);
      }
    });

    test('Quiz ID does not refer to a quiz that this user owns', () => {
      const noQuizzesUser = adminAuthRegister('noquizzesuser@gmail.com', validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
      if ('authUserId' in noQuizzesUser && 'quizId' in newQuiz) {
        expect(adminQuizNameUpdate(noQuizzesUser.authUserId, newQuiz.quizId, 'name Updated')).toEqual(ERROR);
      }
    });

    test('Name contains invalid characters. Valid characters are alphanumeric and spaces', () => {
      if ('authUserId' in newUser && 'quizId' in newQuiz) {
        expect(adminQuizNameUpdate(newUser.authUserId, newQuiz.quizId, 'name Updated!')).toEqual(ERROR);
      }
    });

    test('Name is less than 3 characters long', () => {
      if ('authUserId' in newUser && 'quizId' in newQuiz) {
        expect(adminQuizNameUpdate(newUser.authUserId, newQuiz.quizId, 'na')).toEqual(ERROR);
      }
    });

    test('Name is more than 30 characters long', () => {
      if ('authUserId' in newUser && 'quizId' in newQuiz) {
        expect(adminQuizNameUpdate(newUser.authUserId, newQuiz.quizId, 'nameUpdatednameUpdatednameUpdated')).toEqual(ERROR);
      }
    });

    test('Name is already used by the current logged in user for another quiz', () => {
      if ('authUserId' in newUser && 'quizId' in newQuiz) {
        adminQuizCreate(newUser.authUserId, 'nameOther', validDetails.DESCRIPTION);
        expect(adminQuizNameUpdate(newUser.authUserId, newQuiz.quizId, 'nameOther')).toEqual(ERROR);
      }
    });
  });
});

describe('AdminQuizList', () => {
  let userId: AuthUserIdReturn | ErrorObject;
  let quiz: QuizIdReturn | ErrorObject;
  let quiz1: QuizIdReturn | ErrorObject;
  beforeEach(() => {
    userId = adminAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    if ('authUserId' in userId) {
      quiz = adminQuizCreate(userId.authUserId, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
    }
  });

  // error case
  test('invalid authUserId', () => {
    clear();
    if ('authUserId' in userId) {
      expect(adminQuizList(userId.authUserId)).toStrictEqual(ERROR);
    }
  });

  // success cases:
  test('valid input of 1 quiz', () => {
    if ('authUserId' in userId && 'quizId' in quiz) {
      expect(adminQuizList(userId.authUserId)).toStrictEqual({
        quizzes: [
          {
            quizId: quiz.quizId,
            name: validDetails.QUIZ_NAME,
          }
        ]
      });
    }
  });

  test('valid input of 2 quizzes', () => {
    if ('authUserId' in userId) {
      quiz1 = adminQuizCreate(userId.authUserId, 'nameOther', validDetails.DESCRIPTION);
      if ('quizId' in quiz && 'quizId' in quiz1) {
        expect(adminQuizList(userId.authUserId)).toStrictEqual({
          quizzes: [
            {
              quizId: quiz.quizId,
              name: validDetails.QUIZ_NAME,
            },
            {
              quizId: quiz1.quizId,
              name: 'nameOther',
            },
          ]
        });
      }
    }
  });
});
