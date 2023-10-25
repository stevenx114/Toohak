import {
  adminAuthRegister,
} from './auth';

import {
  adminQuizInfo,
  adminQuizCreate,
  adminQuizList,
  adminQuizNameUpdate,
  adminQuizRemove,
  adminQuizDescriptionUpdate
} from './quiz';

import {
  requestClearV1,
  requestQuizQuestionCreateV1,
} from './wrapper';

import {
  ErrorObject,
  Token,
  QuizIdReturn,
  QuestionBody,
  QuestionId
} from './types';

import {
  clear,
} from './other';

const ERROR = { error: expect.any(String) };
const NUMBER = expect.any(Number);

describe('adminQuizDescriptionUpdate Test', () => {
  let authUserId;
  let quizId;

  beforeEach(() => {
    clear();
    authUserId = adminAuthRegister('sample@gmail.com', 'samplepassword1', 'firstname', 'lastname');
    quizId = adminQuizCreate(authUserId.authUserId, 'quizName', 'sample');
  });

  describe('Invalid Input Tests', () => {
    test('authUserId is invalid', () => {
      clear();
      expect(adminQuizDescriptionUpdate(authUserId.authUserId + 0.1, quizId.quizId, '')).toStrictEqual(ERROR);
    });

    test('Invalid quizId', () => {
      clear();
      authUserId = adminAuthRegister('johnsmith@gmail.com', 'ilovecat123', 'John', 'Smith');
      expect(adminQuizInfo(authUserId.authUserId, quizId.quizId + 0.1)).toStrictEqual(ERROR);
    });

    test('quizId user doesnt own', () => {
      const authUserId2 = adminAuthRegister('testing@gmail.com', 'badpassword44', 'Testing', 'testing');
      expect(adminQuizDescriptionUpdate(authUserId2.authUserId, quizId.quizId, '')).toStrictEqual(ERROR);
    });

    test('Invalid Description', () => {
      const longDescription = 'a'.repeat(105);
      expect(adminQuizDescriptionUpdate(authUserId.authUserId, quizId.quizId, longDescription)).toStrictEqual(ERROR);
    });
  });

  describe('Valid Input test', () => {
    test('All inputs are valid', () => {
      expect(adminQuizDescriptionUpdate(authUserId.authUserId, quizId.quizId, 'newDescription')).toStrictEqual({});
      expect((adminQuizInfo(authUserId.authUserId, quizId.quizId)).description).toStrictEqual('newDescription');
    });

    test('All inputs are valid but description is empty string', () => {
      expect(adminQuizDescriptionUpdate(authUserId.authUserId, quizId.quizId, '')).toStrictEqual({});
      expect((adminQuizInfo(authUserId.authUserId, quizId.quizId)).description).toStrictEqual('');
    });
  });
});

beforeEach(() => {
  clear();
});

// Tests for adminQuizInfo function
describe('adminQuizInfo Test', () => {
  let ownsQuizUser;
  let noQuizUser;
  let quiz;

  beforeEach(() => {
    ownsQuizUser = adminAuthRegister('johnsmith@gmail.com', 'ilovecat123', 'John', 'Smith');
    noQuizUser = adminAuthRegister('alina@gmail.com', 'ihatecat123', 'Alina', 'Jie');
    quiz = adminQuizCreate(ownsQuizUser.authUserId, 'Cat', 'I love cats');
  });

  // Success cases for adminQuizInfo function
  describe('Success Cases', () => {
    test('Correct details', () => {
      expect(adminQuizInfo(ownsQuizUser.authUserId, quiz.quizId)).toStrictEqual({
        quizId: quiz.quizId,
        name: 'Cat',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'I love cats',
      });
    });
  });

  // Error cases for adminQuizInfo function
  describe('Error cases', () => {
    test('AuthUserId is not a valid user', () => {
      clear();
      expect(adminQuizInfo(ownsQuizUser.authUserId, quiz.quizId)).toStrictEqual(ERROR);
    });

    test('Quiz ID does not refer to a valid quiz', () => {
      clear();
      ownsQuizUser = adminAuthRegister('johnsmith@gmail.com', 'ilovecat123', 'John', 'Smith');
      expect(adminQuizInfo(ownsQuizUser.authUserId, quiz.quizId + 0.1)).toStrictEqual(ERROR);
    });

    test('Quiz ID does not refer to a quiz that this user owns', () => {
      expect(adminQuizInfo(noQuizUser.authUserId, quiz.quizId)).toStrictEqual(ERROR);
    });
  });
});

// Tests for AdminQuizCreate function
describe('AdminQuizCreate', () => {
  let userId;

  beforeEach(() => {
    userId = adminAuthRegister('voxekov792@estudys.com', 'quickbrown1', 'Alex', 'Smith');
    adminQuizCreate(userId.authUserId, 'Australia', 'description');
  });

  // Error cases for AdminQuizCreate function
  test('invalid authUserId', () => {
    clear();
    expect(adminQuizCreate(userId.authUserId, 'human history', 'description')).toStrictEqual(ERROR);
  });

  test.each([
    { name: '' }, // empty
    { name: '!23' }, // invalid char
    { name: '!*^&' }, // invalid char
    { name: 'qw' }, // < 2 chars
    { name: '12' }, // < 2 chars
    { name: 'qwerty'.repeat(6) }, // > 30 chars
  ])('invalid name input: $name', ({ name }) => {
    expect(adminQuizCreate(userId.authUserId, name, 'description')).toStrictEqual(ERROR);
  });

  const longDescription = 'description'.repeat(10);
  test('description too long', () => {
    expect(adminQuizCreate(userId.authUserId, 'games', longDescription)).toStrictEqual(ERROR);
  });

  test('existing quiz name', () => {
    expect(adminQuizCreate(userId.authUserId, 'Australia', 'description')).toStrictEqual(ERROR);
  });

  // Success case for adminQuizCreate function
  test('Valid input', () => {
    expect(adminQuizCreate(userId.authUserId, 'human history', 'description')).toStrictEqual({
      quizId: expect.any(Number),
    });
  });

  test('Valid input, description empty', () => {
    expect(adminQuizCreate(userId.authUserId, 'human history', '')).toStrictEqual({
      quizId: expect.any(Number),
    });
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
  let userIdOne;
  let noQuizUserId;
  let quizOne;
  let quizTwo;
  beforeEach(() => {
    clear();
    userIdOne = adminAuthRegister(userOne.email, userOne.password, userOne.nameFirst, userOne.nameLast);
    noQuizUserId = adminAuthRegister(noQuizUser.email, noQuizUser.password, noQuizUser.nameFirst, noQuizUser.nameLast);
    quizOne = adminQuizCreate(userIdOne.authUserId, 'testQuizOne', 'descriptionOne');
    quizTwo = adminQuizCreate(userIdOne.authUserId, 'testQuizTwo', 'descriptionTwo');
  });
  describe('Success cases', () => {
    test('Successful removal of quiz one', () => {
      adminQuizRemove(userIdOne.authUserId, quizOne.quizId);
      expect(adminQuizList(userIdOne.authUserId)).toStrictEqual({
        quizzes: [
          {
            quizId: quizTwo.quizId,
            name: 'testQuizTwo'
          }
        ]
      });
    });
    test('Successful removal of quiz two', () => {
      expect(adminQuizRemove(userIdOne.authUserId, quizTwo.quizId)).toEqual({});
      expect(adminQuizList(userIdOne.authUserId)).toStrictEqual({
        quizzes: [
          {
            quizId: quizOne.quizId,
            name: 'testQuizOne'
          }
        ]
      });
    });
  });
  describe('Error Cases', () => {
    test('Testing for invalid user Id', () => {
      clear();
      expect(adminQuizRemove(userIdOne.authUserId, quizOne.quizId)).toStrictEqual(ERROR);
    });
    test('Testing for invalid quiz Id', () => {
      clear();
      userIdOne = adminAuthRegister(userOne.email, userOne.password, userOne.nameFirst, userOne.nameLast);
      expect(adminQuizRemove(userIdOne.authUserId, quizOne.quizId)).toStrictEqual(ERROR);
    });
    test('Quiz Id does not refer to a quiz that this user owns', () => {
      expect(adminQuizRemove(noQuizUserId.authUserId, quizOne.quizId)).toStrictEqual(ERROR);
    });
  });
});

// Tests for adminQuizNameUpdate function
describe('adminQuizNameUpdate', () => {
  let newUser;
  let newQuiz;
  beforeEach(() => {
    newUser = adminAuthRegister('johnsmith@gmail.com', 'ilovedog123', 'John', 'Smith');
    newQuiz = adminQuizCreate(newUser.authUserId, 'nameNew', 'descriptionNew');
  });

  // Success cases for adminQuizNameUpdate function
  describe('Success Cases', () => {
    test('Successful implementation', () => {
      expect(adminQuizNameUpdate(newUser.authUserId, newQuiz.quizId, 'name Updated')).toEqual({});
      const curQuiz = adminQuizInfo(newUser.authUserId, newQuiz.quizId);
      expect(curQuiz.name).toEqual('name Updated');
    });
  });

  // Error cases for adminQuizNameUpdate function
  describe('Error cases', () => {
    test('AuthUserId is not a valid user', () => {
      clear();
      expect(adminQuizNameUpdate(newUser.authUserId, newQuiz.quizId, 'name Updated')).toEqual(ERROR);
    });

    test('Quiz ID does not refer to a valid quiz', () => {
      clear();
      newUser = adminAuthRegister('johnsmith@gmail.com', 'ilovedog123', 'John', 'Smith');
      expect(adminQuizNameUpdate(newUser.authUserId, newQuiz.quizId, 'name Updated')).toEqual(ERROR);
    });

    test('Quiz ID does not refer to a quiz that this user owns', () => {
      const noQuizzesUser = adminAuthRegister('george@gmail.com', 'ilovedog123', 'George', 'Smith');
      expect(adminQuizNameUpdate(noQuizzesUser.authUserId, newQuiz.quizId, 'name Updated')).toEqual(ERROR);
    });

    test('Name contains invalid characters. Valid characters are alphanumeric and spaces', () => {
      expect(adminQuizNameUpdate(newUser.authUserId, newQuiz.quizId, 'name Updated!')).toEqual(ERROR);
    });

    test('Name is less than 3 characters long', () => {
      expect(adminQuizNameUpdate(newUser.authUserId, newQuiz.quizId, 'na')).toEqual(ERROR);
    });

    test('Name is more than 30 characters long', () => {
      expect(adminQuizNameUpdate(newUser.authUserId, newQuiz.quizId, 'nameUpdatednameUpdatednameUpdated')).toEqual(ERROR);
    });

    test('Name is already used by the current logged in user for another quiz', () => {
      adminQuizCreate(newUser.authUserId, 'nameOther', 'descriptionNew');
      expect(adminQuizNameUpdate(newUser.authUserId, newQuiz.quizId, 'nameOther')).toEqual(ERROR);
    });
  });
});

describe('AdminQuizList', () => {
  let userId;
  let quiz;
  let quiz1;
  beforeEach(() => {
    userId = adminAuthRegister('voxekov792@estudys.com', 'quickbrown1', 'Alex', 'Smith');
    quiz = adminQuizCreate(userId.authUserId, 'human history', 'description');
  });

  // error case
  test('invalid authUserId', () => {
    clear();
    expect(adminQuizList(userId.authUserId)).toStrictEqual(ERROR);
  });

  // success cases:
  test('valid input of 1 quiz', () => {
    expect(adminQuizList(userId.authUserId)).toStrictEqual({
      quizzes: [
        {
          quizId: quiz.quizId,
          name: 'human history',
        }
      ]
    });
  });

  test('valid input of 2 quizzes', () => {
    quiz1 = adminQuizCreate(userId.authUserId, 'animals', 'description');
    expect(adminQuizList(userId.authUserId)).toStrictEqual({
      quizzes: [
        {
          quizId: quiz.quizId,
          name: 'human history',
        },
        {
          quizId: quiz1.quizId,
          name: 'animals',
        },
      ]
    });
  });
});

const VALID_Q_BODY: QuestionBody = {
  question: 'question',
  duration: 3,
  points: 3,
  answers: [
    {
      answer: 'answer1',
      correct: false
    },
    {
      answer: 'answer2',
      correct: true
    }
  ]
}

const TEST_EMAIL = 'sample@gmail.com';
const TEST_PASSWORD = 'samplepassword1';
const TEST_NAME_FIRST_1 = 'John';
const TEST_NAME_LAST_1 = 'Smith';
const TEST_NAME_FIRST_2 = 'Alina';
const TEST_NAME_LAST_2 = 'Jie';
const TEST_QUIZ_NAME = 'Human History';
const TEST_QUIZ_NAME_2 = 'Wild Animals';
const TEST_DESCRIPTION = 'description';

describe('Tests for adminQuizQuestionCreate', () => {
  let registerReturn: Token | ErrorObject;
  let quizCreateReturn: Quizid | ErrorObject;
  let user1;
  let quizId;
  beforeEach(() => {
    requestClearV1(); // Clear the data to make each test independent from one another
    registerReturn = requestAuthRegister(TEST_EMAIL, TEST_PASSWORD, TEST_FIRST_NAME_1, TEST_LAST_NAME_1);
    user1 = registerReturn as Token;
    quizCreateReturn = requestQuizCreateV1(user1.token, TEST_QUIZ_NAME, TEST_DESCRIPTION);
    quiz1 = quizCreateReturn as QuizId;
  })
  // Error tests
  // Tests for invalid token structure
  test.each([
    { token: ''},
    { token: user1.token + 1 },
  ])("Invalid token structure: '$token'", ({ token }) => {
    expect(requestQuizQuestionCreateV1(token, quiz1.quzId, VALID_Q_BODY)).toStrictEqual(ERROR);
  })

  // Tests for valid token but does not refer to valid logged in user session
  test("Valid token but not for logged in user", () => {
    // Create a second user and store their token into another variable, then log them out. 
    const user2 = requestAuthRegister(TEST_EMAIL, TEST_PASSWORD, TEST_FIRST_NAME_1, TEST_LAST_NAME_1);
    const token2 = user2 as Token;
    requestLogoutV1(token2.token); // [Havent imported this function yet]

    // Valid token but the user is already logged out
    expect(requestQuizQuestionCreateV1(token2.token, quiz1.quizId, VALID_Q_BODY)).toStrictEqual(ERROR);
  });

  // Tests for valid token provided but user is not the owner of quiz
  test("valid token but not the correct quiz owner", () => {
    // Create a second user and a quiz. 
    const user2 = requestAuthRegister(TEST_EMAIL, TEST_PASSWORD, TEST_FIRST_NAME_1, TEST_LAST_NAME_1);
    const token2 = user2 as Token;
    requestQuizCreateV1(user1.token, TEST_QUIZ_NAME, TEST_DESCRIPTION);

    // Try to add question into another quiz from the second user.
    expect(requestQuizQuestionCreateV1(token2.token, quiz1.quizId, VALID_Q_BODY)).toStrictEqual(ERROR);
  });

  // Tests for invalid question body 
  test.each([
    {
      questionBody: {
        question: 'ques',
        duration: 3,
        points: 3,
        answers: [
          {
            answer: 'answer1',
            correct: false
          },
          {
            answer: 'answer2',
            correct: true
          }
        ]
      }
    }, // Question string < 5 chars
    {
      questionBody: {
        question: 'question'.repeat(6),
        duration: 3,
        points: 3,
        answers: [
          {
            answer: 'answer1',
            correct: false
          },
          {
            answer: 'answer2',
            correct: true
          }
        ]
      }
    },  // Question string > 50 chars
    {
      questionBody: {
        question: 'question',
        duration: -3,
        points: 3,
        answers: [
          {
            answer: 'answer1',
            correct: false
          },
          {
            answer: 'answer2',
            correct: true
          }
        ]
      }
    },  // Question duration < 0
    {
      questionBody: {
        question: 'question',
        duration: 3 * 1000,
        points: 3,
        answers: [
          {
            answer: 'answer1',
            correct: false
          },
          {
            answer: 'answer2',
            correct: true
          }
        ]
      }
    }, // Question duration > 3 mins
    {
      questionBody: {
        question: 'question',
        duration: 3,
        points: 3,
        answers: [
          {
            answer: 'answer1',
            correct: false
          },
          {
            answer: 'answer2',
            correct: true
          },
          {
            answer: 'answer3',
            correct: false
          },
          {
            answer: 'answer4',
            correct: true
          },
          {
            answer: 'answer5',
            correct: false
          },
          {
            answer: 'answer6',
            correct: true
          }
        ]
      }
    }, // Question has > 6 answers
    {
      questionBody: {
        question: 'question',
        duration: 3,
        points: 3,
        answers: [
          {
            answer: 'answer1',
            correct: false
          },
        ]
      }
    }, // Question has < 2 answers
    {
      questionBody: {
        question: 'question',
        duration: 3,
        points: 0,
        answers: [
          {
            answer: 'answer1',
            correct: false
          },
          {
            answer: 'answer2',
            correct: true
          }
        ]
      }
    }, // Question points < 1
    {
      questionBody: {
        question: 'question',
        duration: 11,
        points: 3,
        answers: [
          {
            answer: 'answer1',
            correct: false
          },
          {
            answer: 'answer2',
            correct: true
          }
        ]
      }
    }, // Question points > 10
    {
      questionBody: {
        question: 'question',
        duration: 3,
        points: 3,
        answers: [
          {
            answer: '',
            correct: false
          },
          {
            answer: 'answer2',
            correct: true
          }
        ]
      }
    }, // Question answer < 1 char
    {
      questionBody: {
        question: 'question',
        duration: 3,
        points: 3,
        answers: [
          {
            answer: 'answer1'.repeat(10),
            correct: false
          },
          {
            answer: 'answer2',
            correct: true
          }
        ]
      }
    }, // Question answer > 30 chars
    {
      questionBody: {
        question: 'question',
        duration: 3,
        points: 3,
        answers: [
          {
            answer: 'answer1',
            correct: false
          },
          {
            answer: 'answer1',
            correct: true
          }
        ]
      }
    }, // Question has duplicate answers
    {
      questionBody: {
        question: 'question',
        duration: 3,
        points: 3,
        answers: [
          {
            answer: 'answer1',
            correct: false
          },
          {
            answer: 'answer2',
            correct: false
          }
        ]
      }
    }, // Question has no correct answers
  ])("Invalid question body: '$questionBody'", ({ questionBody }) => {
    expect(requestQuizQuestionCreateV1(user1.token, quiz1.quizId, questionBody)).toStrictEqual(ERROR);
  });

  // Success test
  // Tests for the successful creation of questionId
  test("Valid output of questionId", () => {
    const newQuestion = requestCreateQuestionV1(user1.token, quiz.quizId, VALID_Q_BODY);
    const question = newQuestion.questionId as QuestionId;
    expect(question.questionId).toStictEqual(NUMBER);
  });
});