import {
  validDetails,
  ErrorObject,
  QuizIdReturn,
  QuestionIdReturn,
  TokenReturn,
  QuestionBody
} from '../types';

import {
  requestQuizQuestionDelete,
  requestQuizQuestionCreate,
  requestQuizCreate,
  requestClear,
  requestQuizInfo,
  requestAuthRegister
} from './wrapper';

const ERROR = expect.any(String);

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

describe('Tests for adminQuizQuestionDelete', () => {
  requestClear();
  let registerReturn: TokenReturn | ErrorObject;
  let quizCreateReturn: QuizIdReturn | ErrorObject;
  let questionCreateReturn;
  let user1: TokenReturn;
  let quiz1: QuizIdReturn;
  let question1: QuestionIdReturn;
  beforeEach(() => {
    requestClear();
    registerReturn = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    user1 = registerReturn as TokenReturn;
    quizCreateReturn = requestQuizCreate(user1.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
    quiz1 = quizCreateReturn as QuizIdReturn;
    questionCreateReturn = requestQuizQuestionCreate(user1.token, quiz1.quizId, VALID_Q_BODY);
    question1 = questionCreateReturn as QuestionIdReturn;
  });

  // Error Cases
  test('Question Id does not refer to a valid question', () => {
    requestQuizQuestionDelete(user1.token, quiz1.quizId, question1.questionId); // Question doesnt exist anymore
    const errorResult = requestQuizQuestionDelete(user1.token, quiz1.quizId, question1.questionId);
    expect(errorResult.error).toStrictEqual(ERROR);
    expect(errorResult.statusCode).toStrictEqual(400);
  });

  test('Token is empty', () => {
    const errorResult = requestQuizQuestionDelete('', quiz1.quizId, question1.questionId);
    expect(errorResult.error).toStrictEqual(ERROR);
    expect(errorResult.statusCode).toStrictEqual(401);
  });

  test('Token is invalid', () => {
    requestClear(); // Nothing in data
    const errorResult = requestQuizQuestionDelete(user1.token, quiz1.quizId, question1.questionId);
    expect(errorResult.error).toStrictEqual(ERROR);
    expect(errorResult.statusCode).toStrictEqual(401);
  });

  test('Token is valid but user is not owner of the quiz', () => {
    // Create new user who doesnt own any quizzes
    const newUser = requestAuthRegister(validDetails.EMAIL_2, validDetails.PASSWORD_2, validDetails.FIRST_NAME_2, validDetails.LAST_NAME_2);
    const errorResult = requestQuizQuestionDelete(newUser.token, quiz1.quizId, question1.questionId);
    expect(errorResult.error).toStrictEqual(ERROR);
    expect(errorResult.statusCode).toStrictEqual(403);
  });

  // Success cases
  test('Successfuly return of empty object and removal of question', () => {
    requestQuizQuestionDelete(user1.token, quiz1.quizId, question1.questionId);
    expect(requestQuizInfo(user1.token, quiz1.quizId)).toStrictEqual({
      quizId: quiz1.quizId,
      name: validDetails.QUIZ_NAME,
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: validDetails.DESCRIPTION,
      numQuestions: 0,
      questions: [],
      duration: 0
    });
  });
});
