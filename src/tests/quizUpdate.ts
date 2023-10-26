import { Token } from "../dataStore";
import { questionBody } from "../types";
import { QuizIdReturn, validDetails } from "../types";
import { requestAuthRegister, requestClear, requestQuizCreate, requestQuizUpdate } from "./wrapper";

const validQuestionDetails: questionBody = {
    question: "Who is the Monarch of England?",
    duration: 4,
    points: 5,
    answers: [{
        answer: "Prince Charles",
        correct: true,
    }]
};

const ERROR = {error: expect.any(String)};

describe('quizUpdate', () => {
    let token: Token;
    let quizId: QuizIdReturn;
    let questionId;
    let questionBody;

    beforeEach(() => {  
        requestClear();
        token = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME).body;
        quizId = requestQuizCreate(token.sessionId, validDetails.QUIZ_NAME, validDetails.DESCRIPTION).body;
        //questionId = requestQuestionCreate(quizId.quizId, token.sessionId, validQuestionDetails).body;
        questionBody = {...validQuestionDetails};
    });
  
    describe('Invalid Input Tests', () => {
      test('Question Id does not refer to a valid question within this quiz', () => {
        requestQuizUpdate(quizId.quizId, question
      });
  
      test('Quiz ID refers to a quiz that is not currently in the trash', () => {

      });
  
      test('Token is empty', () => {

      });

      test('Token is invalid and does not refer to a valid loggin in user', () => {

      });
  
      test('Valid token is provided, but user is not an owner of this quiz', () => {

      });
    });
  
    describe('Valid Input test', () => {
      test('All inputs are valid', () => {

      });
    });
  });
