import {
  ErrorObject,
  TokenReturn,
  QuizIdReturn,
  QuestionBody,
  QuestionIdReturn,
  validDetails,
} from '../types';

const NUMBER = expect.any(Number);
const ERROR = expect.any(String);

import {
  requestQuizQuestionCreate,
  requestAuthRegister,
  requestQuizCreate,
  requestLogout,
  requestClear,
  requestQuizInfo
} from './wrapper';

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
};
describe.only('Tests for adminQuizQuestionCreate', () => {
  let registerReturn: TokenReturn | ErrorObject;
  let quizCreateReturn: QuizIdReturn | ErrorObject;
  let user1: TokenReturn;
  let quiz1: QuizIdReturn;

  beforeEach(() => {
    requestClear(); // Clear the data to make each test independent from one another
    registerReturn = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    user1 = registerReturn as TokenReturn;
    quizCreateReturn = requestQuizCreate(user1.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
    quiz1 = quizCreateReturn as QuizIdReturn;
  });

  // Error tests
  // Tests for invalid token structure
  test('Empty token', () => {
    const errorResult = requestQuizQuestionCreate('', quiz1.quizId, VALID_Q_BODY);
    expect(errorResult.error).toStrictEqual(ERROR);
    expect(errorResult.statusCode).toStrictEqual(401);
  });

  test('Invalid token', () => {
    const errorResult = requestQuizQuestionCreate(user1.token + 1, quiz1.quizId, VALID_Q_BODY);
    expect(errorResult.error).toStrictEqual(ERROR);
    expect(errorResult.statusCode).toStrictEqual(401);
  });

  test('Valid token but not for logged in user', () => {
    const user2 = requestAuthRegister(validDetails.EMAIL_2, validDetails.PASSWORD_2, validDetails.FIRST_NAME_2, validDetails.LAST_NAME_2);
    const token2 = user2 as TokenReturn;
    requestLogout(token2.token);

    const errorResult = requestQuizQuestionCreate(token2.token, quiz1.quizId, VALID_Q_BODY);
    expect(errorResult.error).toStrictEqual(ERROR);
    expect(errorResult.statusCode).toStrictEqual(401);
  });

  test('Valid token but not the correct quiz owner', () => {
    const user2 = requestAuthRegister(validDetails.EMAIL_2, validDetails.PASSWORD_2, validDetails.FIRST_NAME_2, validDetails.LAST_NAME_2);

    // Try to add question into another quiz from the second user.
    const errorResult = requestQuizQuestionCreate(user2.token, quiz1.quizId, VALID_Q_BODY);
    expect(errorResult.error).toStrictEqual(ERROR);
    expect(errorResult.statusCode).toStrictEqual(403);
  });

  // Tests for invalid question body
  test.each([
    {
      questionBody: {
        question: 'pog',
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
        question: 'question'.repeat(10),
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
    }, // Question string > 50 chars
    {
      questionBody: {
        question: 'question',
        duration: 0,
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
    }, // Question duration < 0
    {
      questionBody: {
        question: 'question',
        duration: 3000,
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
        points: 11,
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
    const errorResult = requestQuizQuestionCreate(user1.token, quiz1.quizId, questionBody);
    expect(errorResult.error).toStrictEqual(ERROR);
    expect(errorResult.statusCode).toStrictEqual(400);
  });

  // Success test
  // Tests for the successful creation of questionId
  test('Valid output of questionId', () => {
    const initialTime = requestQuizInfo(user1.token, quiz1.quizId).timeLastEdited;
    const newQuestion: QuestionIdReturn = requestQuizQuestionCreate(user1.token, quiz1.quizId, VALID_Q_BODY);
    const question = newQuestion.questionId;
    expect(question).toStrictEqual(NUMBER);
    const finalTime = requestQuizInfo(user1.token, quiz1.quizId).timeLastEdited;
    expect(finalTime).toBeGreaterThanOrEqual(initialTime);
    expect(finalTime).toBeLessThanOrEqual(initialTime + 1);
  });
});
