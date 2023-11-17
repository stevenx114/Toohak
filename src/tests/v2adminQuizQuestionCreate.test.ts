import {
  TokenReturn,
  QuizIdReturn,
  QuestionBody,
  validDetails
} from '../types';

import HTTPError from 'http-errors';

const QUESTION = { questionId: expect.any(Number) };
const NUMBER = expect.any(Number);
const STRING = expect.any(String);

import {
  requestQuizQuestionCreateV2,
  requestAuthRegister,
  requestQuizCreateV2,
  requestLogoutV2,
  requestClear,
  requestQuizInfoV2
} from './wrapper';

const VALID_Q_BODY_1: QuestionBody = {
  question: 'question1',
  duration: 3,
  points: 3,
  answers: [
    {
      answer: 'Australia',
      correct: true
    },
    {
      answer: 'America',
      correct: false
    }
  ],
  thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png',
};
const VALID_Q_BODY_2: QuestionBody = {
  question: 'question2',
  duration: 7,
  points: 6,
  answers: [
    {
      answer: 'Newton',
      correct: false
    },
    {
      answer: 'Einstein',
      correct: true
    }
  ],
  thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png',
};
const VALID_Q_BODY_3: QuestionBody = {
  question: 'question3',
  duration: 8,
  points: 3,
  answers: [
    {
      answer: 'Leopard',
      correct: true
    },
    {
      answer: 'zebra',
      correct: true
    }
  ],
  thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png',
};

beforeEach(() => {
  requestClear();
});

afterEach(() => {
  requestClear();
});

describe('Tests for adminQuizQuestionCreateV2', () => {
  let user: TokenReturn;
  let quiz: QuizIdReturn;
  beforeEach(() => {
    user = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    quiz = requestQuizCreateV2(user.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
  });

  // Error tests
  test('Empty token', () => {
    expect(() => requestQuizQuestionCreateV2('', quiz.quizId, VALID_Q_BODY_1)).toThrow(HTTPError[401]);
  });

  test('Invalid token', () => {
    expect(() => requestQuizQuestionCreateV2(user.token + 1, quiz.quizId, VALID_Q_BODY_1)).toThrow(HTTPError[401]);
  });

  test('Valid token but not for logged in user', () => {
    const token2 = requestAuthRegister(validDetails.EMAIL_2, validDetails.PASSWORD_2, validDetails.FIRST_NAME_2, validDetails.LAST_NAME_2);
    requestLogoutV2(token2.token);
    expect(() => requestQuizQuestionCreateV2(token2.token, quiz.quizId, VALID_Q_BODY_1)).toThrow(HTTPError[401]);
  });

  test('Valid token but not the correct quiz owner', () => {
    const user2 = requestAuthRegister(validDetails.EMAIL_2, validDetails.PASSWORD_2, validDetails.FIRST_NAME_2, validDetails.LAST_NAME_2);
    // Try to add question into another quiz from the second user.
    expect(() => requestQuizQuestionCreateV2(user2.token, quiz.quizId, VALID_Q_BODY_1)).toThrow(HTTPError[403]);
  });

  // Tests for invalid question body
  test.each([
    {
      testCase: 'Question string < 5 chars',
      QuestionBody: {
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
      testCase: 'Question string > 50 chars',
      QuestionBody: {
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
        ],
        thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png',
      }
    }, // Question string > 50 chars
    {
      testCase: 'Question duration < 0',
      QuestionBody: {
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
        ],
        thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png',
      }
    }, // Question duration < 0
    {
      testCase: 'Question duration > 3 mins',
      QuestionBody: {
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
        ],
        thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png',
      }
    }, // Question duration > 3 mins
    {
      testCase: 'Question has > 6 answers',
      QuestionBody: {
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
        ],
        thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png',
      }
    }, // Question has > 6 answers
    {
      testCase: 'Question has < 2 answers',
      QuestionBody: {
        question: 'question',
        duration: 3,
        points: 3,
        answers: [
          {
            answer: 'answer1',
            correct: false
          },
        ],
        thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png',
      }
    }, // Question has < 2 answers
    {
      testCase: 'Question points < 1',
      QuestionBody: {
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
        ],
        thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png',
      }
    }, // Question points < 1
    {
      testCase: 'Question points > 10',
      QuestionBody: {
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
        ],
        thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png',
      }
    }, // Question points > 10
    {
      testCase: 'Question answer < 1 char',
      QuestionBody: {
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
        ],
        thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png',
      }
    }, // Question answer < 1 char
    {
      testCase: 'Question answer > 30 chars',
      QuestionBody: {
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
        ],
        thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png',
      }
    }, // Question answer > 30 chars
    {
      testCase: 'Question has duplicate answers',
      QuestionBody: {
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
        ],
        thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png',
      }
    }, // Question has duplicate answers
    {
      testCase: 'Question has no correct answers',
      QuestionBody: {
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
        ],
        thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png',
      }
    }, // Question has no correct answers
    {
      testCase: 'Thumbnail is empty',
      QuestionBody: {
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
        ],
        thumbnailUrl: '',
      }
    }, // Thumbnail is empty
    {
      testCase: "Doesnt start with 'http://'",
      QuestionBody: {
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
        ],
        thumbnailUrl: 'www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png',
      }
    }, // Doesnt start with 'http://'
    {
      testCase: "Doesn't end with the following filetypes: jpg, jpeg, png",
      QuestionBody: {
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
        ],
        thumbnailUrl: 'www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart',
      }
    }, // Doesn't end with the following filetypes: jpg, jpeg, png
  ])("Invalid question body: '$testCase'", ({ testCase, QuestionBody }) => {
    expect(() => requestQuizQuestionCreateV2(user.token, quiz.quizId, QuestionBody)).toThrow(HTTPError[400]);
  });

  // Success Cases
  // Tests for the successful creation of questionId
  test('timeLastEdited is maintained', () => {
    const initialTime = requestQuizInfoV2(user.token, quiz.quizId).timeLastEdited;
    expect(requestQuizQuestionCreateV2(user.token, quiz.quizId, VALID_Q_BODY_1)).toStrictEqual(QUESTION);
    const finalTime = requestQuizInfoV2(user.token, quiz.quizId).timeLastEdited;
    expect(finalTime).toBeGreaterThanOrEqual(initialTime);
  });

  test('Successful creation of question', () => {
    const question1 = requestQuizQuestionCreateV2(user.token, quiz.quizId, VALID_Q_BODY_1);
    const question2 = requestQuizQuestionCreateV2(user.token, quiz.quizId, VALID_Q_BODY_2);
    const question3 = requestQuizQuestionCreateV2(user.token, quiz.quizId, VALID_Q_BODY_3);
    expect(requestQuizInfoV2(user.token, quiz.quizId)).toStrictEqual({
      quizId: quiz.quizId,
      name: validDetails.QUIZ_NAME,
      timeCreated: NUMBER,
      timeLastEdited: NUMBER,
      description: validDetails.DESCRIPTION,
      numQuestions: 3,
      questions: [
        {
          questionId: question1.questionId,
          question: 'question1',
          duration: 3,
          thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png',
          points: 3,
          answers: [
            {
              answerId: NUMBER,
              answer: 'Australia',
              colour: STRING,
              correct: true
            },
            {
              answerId: NUMBER,
              answer: 'America',
              colour: STRING,
              correct: false
            }
          ]
        },
        {
          questionId: question2.questionId,
          question: 'question2',
          duration: 7,
          thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png',
          points: 6,
          answers: [
            {
              answerId: NUMBER,
              answer: 'Newton',
              colour: STRING,
              correct: false
            },
            {
              answerId: NUMBER,
              answer: 'Einstein',
              colour: STRING,
              correct: true
            }
          ]
        },
        {
          questionId: question3.questionId,
          question: 'question3',
          duration: 8,
          thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png',
          points: 3,
          answers: [
            {
              answerId: NUMBER,
              answer: 'Leopard',
              colour: STRING,
              correct: true
            },
            {
              answerId: NUMBER,
              answer: 'zebra',
              colour: STRING,
              correct: true
            }
          ]
        },
      ],
      duration: 18
    });
  });
});
