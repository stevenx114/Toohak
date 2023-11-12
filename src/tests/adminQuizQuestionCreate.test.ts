import {
  TokenReturn,
  QuizIdReturn,
  QuestionBody,
  QuestionIdReturn,
  validDetails,
} from '../types';

import HTTPError from 'http-errors';

const NUMBER = { questionId: expect.any(Number) };

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
beforeEach(() => {
  requestClear();
});

describe('Tests for adminQuizQuestionCreate', () => {
  let user1: TokenReturn;
  let quiz1: QuizIdReturn;

  beforeEach(() => {
    user1 = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    quiz1 = requestQuizCreate(user1.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
  });

  // Error tests
  // Tests for invalid token structure
  test('Empty token', () => {
    expect(() => requestQuizQuestionCreate('', quiz1.quizId, VALID_Q_BODY)).toThrow(HTTPError[401]);
  });

  test('Invalid token', () => {
    expect(() => requestQuizQuestionCreate(user1.token + 1, quiz1.quizId, VALID_Q_BODY)).toThrow(HTTPError[401]);
  });

  test('Valid token but not for logged in user', () => {
    const token2 = requestAuthRegister(validDetails.EMAIL_2, validDetails.PASSWORD_2, validDetails.FIRST_NAME_2, validDetails.LAST_NAME_2);
    requestLogout(token2.token);
    expect(() => requestQuizQuestionCreate(token2.token, quiz1.quizId, VALID_Q_BODY)).toThrow(HTTPError[401]);
  });

  test('Valid token but not the correct quiz owner', () => {
    const user2 = requestAuthRegister(validDetails.EMAIL_2, validDetails.PASSWORD_2, validDetails.FIRST_NAME_2, validDetails.LAST_NAME_2);
    // Try to add question into another quiz from the second user.
    expect(() => requestQuizQuestionCreate(user2.token, quiz1.quizId, VALID_Q_BODY)).toThrow(HTTPError[403]);
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
    expect(() => requestQuizQuestionCreate(user1.token, quiz1.quizId, questionBody)).toThrow(HTTPError[400]);
  });

  // Success test
  // Tests for the successful creation of questionId
  test('Valid output of questionId', () => {
    const initialTime = requestQuizInfo(user1.token, quiz1.quizId).timeLastEdited;
    expect(requestQuizQuestionCreate(user1.token, quiz1.quizId, VALID_Q_BODY)).toStrictEqual(NUMBER);
    const finalTime = requestQuizInfo(user1.token, quiz1.quizId).timeLastEdited;
    expect(finalTime).toBeGreaterThanOrEqual(initialTime);
    expect(finalTime).toBeLessThanOrEqual(initialTime + 1);
  });
});
