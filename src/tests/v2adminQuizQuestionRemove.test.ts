import {
    validDetails,
    QuizIdReturn,
    QuestionIdReturn,
    TokenReturn,
    QuestionBody
  } from '../types';
  
  import {
    requestQuizQuestionDeleteV2,
    requestQuizQuestionCreateV2,
    requestQuizCreateV2,
    requestClear,
    requestQuizInfoV2,
    requestAuthRegister,
    requestQuizSessionStart,
    requestSessionStateUpdate
  } from './wrapper';
  
  import HTTPError from 'http-errors';

interface QuizId { quizId: number };
interface TokenObject { token: string };
interface SessionObject { sessionId: number };
interface QuestionObject { questionId: number };
  
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

  afterEach(() => {
    requestClear();
  });
  
  describe('Tests for adminQuizQuestionDelete', () => {
    let user: TokenObject;
    let quiz: QuizId;
    let question: QuestionObject;
    // let session: SessionObject;
    beforeEach(() => {
      requestClear();
      user = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
      quiz = requestQuizCreateV2(user.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
      question = requestQuizQuestionCreateV2(user.token, quiz.quizId, VALID_Q_BODY);
      // session = requestQuizSessionStart(user.token, quiz.quizId, 1); // session is in LOBBY state
    });
  
    // Error Cases
    test('Question Id does not refer to a valid question', () => {
      // requestSessionStateUpdate(user.token, quiz.quizId, session.sessionId, 'END');
      requestQuizQuestionDeleteV2(user.token, quiz.quizId, question.questionId); // Question doesnt exist anymore
      expect(() => requestQuizQuestionDeleteV2(user.token, quiz.quizId, question.questionId)).toThrow(HTTPError[400]);
    });

    // test('Session is not in END state', () => {
    //   expect(() => requestQuizQuestionDeleteV2(user.token, quiz.quizId, question.questionId)).toThrow(HTTPError[400]);
    // });
  
    test('Token is empty', () => {
      expect(() => requestQuizQuestionDeleteV2('', quiz.quizId, question.questionId)).toThrow(HTTPError[401]);
    });
  
    test('Token is invalid', () => {
      expect(() => requestQuizQuestionDeleteV2(user.token + 1, quiz.quizId, question.questionId)).toThrow(HTTPError[401]);
      requestClear(); // Nothing in data
      expect(() => requestQuizQuestionDeleteV2(user.token, quiz.quizId, question.questionId)).toThrow(HTTPError[401]);
    });
  
    test('Token is valid but user is not owner of the quiz', () => {
      // Create new user who doesnt own any quizzes
      const newUser = requestAuthRegister(validDetails.EMAIL_2, validDetails.PASSWORD_2, validDetails.FIRST_NAME_2, validDetails.LAST_NAME_2);
      expect(() => requestQuizQuestionDeleteV2(newUser.token, quiz.quizId, question.questionId)).toThrow(HTTPError[403]);
    });

    // Success cases
    test.skip('Successfuly return of empty object and removal of question', () => {
      // requestSessionStateUpdate(user.token, quiz.quizId, session.sessionId, 'END');
      requestQuizQuestionDeleteV2(user.token, quiz.quizId, question.questionId);
      expect(requestQuizInfoV2(user.token, quiz.quizId)).toStrictEqual({
        quizId: quiz.quizId,
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