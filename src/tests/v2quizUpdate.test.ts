import { TokenReturn, questionBody } from '../types';
import { QuizIdReturn, validDetails, QuestionIdReturn } from '../types';
import { requestAuthRegister, requestClear, requestQuizCreate, requestQuizQuestionCreate, requestQuizUpdateV2 } from './wrapper';

import HTTPError from 'http-errors';

const validQuestionDetails: questionBody = {
  question: 'Who is the Monarch of England?',
  duration: 1,
  points: 1,
  answers: [{
    answer: 'Prince Charles',
    correct: true,
  }, {
    answer: 'hello Charles',
    correct: false,
  },
  ],
};

afterEach(() => {
  requestClear();
});

describe('quizUpdate', () => {
  let token: TokenReturn;
  let quizId: QuizIdReturn;
  let questionId: QuestionIdReturn;
  let questionBody: questionBody;

  beforeEach(() => {
    requestClear();
    token = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    quizId = requestQuizCreate(token.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
    questionId = requestQuizQuestionCreate(token.token, quizId.quizId, validQuestionDetails);
    questionBody = JSON.parse(JSON.stringify(validQuestionDetails));
  });

  describe('Valid Input test', () => {
    test('All inputs are valid', () => {
      const res = requestQuizUpdateV2(quizId.quizId, questionId.questionId, token.token, questionBody);
      expect(res).toStrictEqual({});
    });
  });

  describe('Invalid Input Tests', () => {
    test('Question Id does not refer to a valid question within this quiz', () => {
      expect(() => requestQuizUpdateV2(quizId.quizId, questionId.questionId + 400, token.token, questionBody)).toThrow(HTTPError[400]);
    });

    test('Question string is less than 5 characters in length', () => {
      questionBody.question = '';
      expect(() => requestQuizUpdateV2(quizId.quizId, questionId.questionId, token.token, questionBody)).toThrow(HTTPError[400]);
    });

    test('Question string is greater than 50 characters in length', () => {
      questionBody.question = 'a'.repeat(52);
      expect(() => requestQuizUpdateV2(quizId.quizId, questionId.questionId, token.token, questionBody)).toThrow(HTTPError[400]);
    });

    test('The question has more than 6 answers', () => {
      questionBody.answers.length = 10;
      questionBody.answers.fill(questionBody.answers[0]);
      expect(() => requestQuizUpdateV2(quizId.quizId, questionId.questionId, token.token, questionBody)).toThrow(HTTPError[400]);
    });

    test('The question has less than 2 answers', () => {
      questionBody.answers.length = 1;
      expect(() => requestQuizUpdateV2(quizId.quizId, questionId.questionId, token.token, questionBody)).toThrow(HTTPError[400]);
    });

    test('If this question were to be updated, the sum of the question durations in the quiz exceeds 3 minutes', () => {
      questionBody.duration = 181;
      expect(() => requestQuizUpdateV2(quizId.quizId, questionId.questionId, token.token, questionBody)).toThrow(HTTPError[400]);
    });

    test('The points awarded for the question are less than 1', () => {
      questionBody.points = 0;
      expect(() => requestQuizUpdateV2(quizId.quizId, questionId.questionId, token.token, questionBody)).toThrow(HTTPError[400]);
    });

    test('The points awarded for the question are greater than 10', () => {
      questionBody.points = 11;
      expect(() => requestQuizUpdateV2(quizId.quizId, questionId.questionId, token.token, questionBody)).toThrow(HTTPError[400]);
    });

    test('The length of any answer is shorter than 1 character long', () => {
      questionBody.answers[0].answer = '';
      expect(() => requestQuizUpdateV2(quizId.quizId, questionId.questionId, token.token, questionBody)).toThrow(HTTPError[400]);
    });

    test('Any answer strings are duplicates of one another (within the same question)', () => {
      questionBody.answers.push(questionBody.answers[0]);
      expect(() => requestQuizUpdateV2(quizId.quizId, questionId.questionId, token.token, questionBody)).toThrow(HTTPError[400]);
    });

    test('No Correct Answers', () => {
      questionBody.answers[0].correct = false;
      expect(() => requestQuizUpdateV2(quizId.quizId, questionId.questionId, token.token, questionBody)).toThrow(HTTPError[400]);
    });

    test('Token in empty', () => {
      expect(() => requestQuizUpdateV2(quizId.quizId, questionId.questionId, '', questionBody)).toThrow(HTTPError[401]);
    });

    test('Token is invalid', () => {
      expect(() => requestQuizUpdateV2(quizId.quizId, questionId.questionId, token.token + 'a', questionBody)).toThrow(HTTPError[401]);
    });

    test('Valid token is provided, but user is unauthorised to complete this action', () => {
      const token2 = requestAuthRegister('a' + validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
      expect(() => requestQuizUpdateV2(quizId.quizId, questionId.questionId, token2.token, questionBody)).toThrow(HTTPError[403]);
    });

    test('The length of any answer is longer than 30 characters long', () => {
      questionBody.answers[0].answer = 'a'.repeat(40);
      expect(() => requestQuizUpdateV2(quizId.quizId, questionId.questionId, token.token, questionBody)).toThrow(HTTPError[400]);
    });

    test('The question duration is not a positive number', () => {
      questionBody.duration = -1;
      expect(() => requestQuizUpdateV2(quizId.quizId, questionId.questionId, token.token, questionBody)).toThrow(HTTPError[400]);
    });
  });
});
