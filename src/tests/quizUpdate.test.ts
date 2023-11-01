import { Token } from "../dataStore";
import { TokenReturn, questionAnswer, questionBody } from "../types";
import { QuizIdReturn, validDetails } from "../types";
import { requestAuthRegister, requestClear, requestQuizCreate, requestQuizUpdate } from "./wrapper";

const validQuestionDetails: questionBody = {
    question: "Who is the Monarch of England?",
    duration: 1,
    points: 1,
    answers: [{
        answer: "Prince Charles",
        correct: true,
        }]
};

const ERROR = {error: expect.any(String)};

describe('quizUpdate', () => {
    let token: TokenReturn;
    let quizId: QuizIdReturn;
    let questionId = {
        questionId: 54,
    };
    let questionBody: questionBody;

    beforeEach(() => {  
        requestClear();
        token = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
        quizId = requestQuizCreate(token.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
        questionId = requestQuestionCreate(quizId.quizId, token.token, validQuestionDetails);
        questionBody = {...validQuestionDetails};
    });
  
    describe('Invalid Input Tests', () => {
      test('Question Id does not refer to a valid question within this quiz', () => {
        const res = requestQuizUpdate(quizId.quizId, questionId.questionId + 0.1, token.token, questionBody);
        expect(res.statusCode).toBe(400);
        expect(res.error).toStrictEqual(ERROR);
      });
  
      test('Question string is less than 5 characters in length', () => {
        questionBody.question = '';
        const res = requestQuizUpdate(quizId.quizId, questionId.questionId, token.token, questionBody);
        expect(res.statusCode).toBe(400);
        expect(res.error).toStrictEqual(ERROR);
      });

      test('Question string is greater than 50 characters in length', () => {
        questionBody.question = 'a'.repeat(52);
        const res = requestQuizUpdate(quizId.quizId, questionId.questionId, token.token, questionBody);
        expect(res.statusCode).toBe(400);
        expect(res.error).toStrictEqual(ERROR);
      });
      
      test('The question has more than 6 answers', () => {
        questionBody.answers.length = 10;      
        questionBody.answers.fill(questionBody.answers[0]);

        const res = requestQuizUpdate(quizId.quizId, questionId.questionId, token.token, questionBody);
        expect(res.statusCode).toBe(400);
        expect(res.error).toStrictEqual(ERROR);
      });

      test('The question has less than 2 answers', () => {
        questionBody.answers.length = 1;      

        const res = requestQuizUpdate(quizId.quizId, questionId.questionId, token.token, questionBody);
        expect(res.statusCode).toBe(400);
        expect(res.error).toStrictEqual(ERROR);
      });

      test('If this question were to be updated, the sum of the question durations in the quiz exceeds 3 minutes', () => { 
        questionBody.duration = 181;

        const res = requestQuizUpdate(quizId.quizId, questionId.questionId, token.token, questionBody);
        expect(res.statusCode).toBe(400);
        expect(res.error).toStrictEqual(ERROR);
      });

      test('The points awarded for the question are less than 1', () => { 
        questionBody.points = 0;

        const res = requestQuizUpdate(quizId.quizId, questionId.questionId, token.token, questionBody);
        expect(res.statusCode).toBe(400);
        expect(res.error).toStrictEqual(ERROR);
      });

      test('The points awarded for the question are greater than 10', () => { 
        questionBody.points = 11;

        const res = requestQuizUpdate(quizId.quizId, questionId.questionId, token.token, questionBody);
        expect(res.statusCode).toBe(400);
        expect(res.error).toStrictEqual(ERROR);
      });


      test('The length of any answer is shorter than 1 character long', () => { 
        questionBody.answers[0].answer = '';

        const res = requestQuizUpdate(quizId.quizId, questionId.questionId, token.token, questionBody);
        expect(res.statusCode).toBe(400);
        expect(res.error).toStrictEqual(ERROR);
      });

      test('The length of any answer is longer than 30 characters long', () => { 
        questionBody.answers[0].answer = 'a'.repeat(40);

        const res = requestQuizUpdate(quizId.quizId, questionId.questionId, token.token, questionBody);
        expect(res.statusCode).toBe(400);
        expect(res.error).toStrictEqual(ERROR);
      });


      test('Any answer strings are duplicates of one another (within the same question)', () => { 
        questionBody.answers.push(questionBody.answers[0]);

        const res = requestQuizUpdate(quizId.quizId, questionId.questionId, token.token, questionBody);
        expect(res.statusCode).toBe(400);
        expect(res.error).toStrictEqual(ERROR);
      });

      test('No Correct Answers', () => { 
        questionBody.answers[0].correct = false;

        const res = requestQuizUpdate(quizId.quizId, questionId.questionId, token.token, questionBody);
        expect(res.statusCode).toBe(400);
        expect(res.error).toStrictEqual(ERROR);
      });


      test('Token in empty', () => { 
        const res = requestQuizUpdate(quizId.quizId, questionId.questionId, '', questionBody);
        expect(res.statusCode).toBe(401);
        expect(res.error).toStrictEqual(ERROR);
      });

      test('Token is invalid', () => { 
        const res = requestQuizUpdate(quizId.quizId, questionId.questionId, token.token + 'a', questionBody);
        expect(res.statusCode).toBe(401);
        expect(res.error).toStrictEqual(ERROR);
      });

      test('Valid token is provided, but user is unauthorised to complete this action', () => { 
        token = requestAuthRegister('a' + validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);

        const res = requestQuizUpdate(quizId.quizId, questionId.questionId, token.token + 'a', questionBody);
        expect(res.statusCode).toBe(403);
        expect(res.error).toStrictEqual(ERROR);
      });

    });
  
    describe('Valid Input test', () => {
      test('All inputs are valid', () => {
        const res = requestQuizUpdate(quizId.quizId, questionId.questionId, token.token, questionBody);
        expect(res).toStrictEqual(ERROR);
      });
    });
  });
