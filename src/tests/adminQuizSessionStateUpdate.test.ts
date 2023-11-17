import {
  validDetails,
  QuestionBody,
  TokenReturn,
  QuizIdReturn,
  SessionIdReturn,
  sessionState,
  sessionAction
} from '../types';

import {
  requestClear,
  requestAuthRegister,
  requestQuizQuestionCreate,
  requestQuizCreate,
  requestQuizSessionStart,
  requestSessionStateUpdate,
  requestSessionStatus
} from './wrapper';

import {
  sleepSync
} from '../helper';

import HTTPError from 'http-errors';

const validAutoStartNum = 5;

const VALID_Q_BODY_1: QuestionBody = {
  question: 'question1',
  duration: 1,
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
const VALID_Q_BODY_2: QuestionBody = {
  question: 'question2',
  duration: 1,
  points: 4,
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

let user: TokenReturn;
let noQuizzesUser: TokenReturn;
let quiz1: QuizIdReturn;
let quiz2: QuizIdReturn;
let session1: SessionIdReturn;
let session2: SessionIdReturn;

const goToQuestionCountdown = (token: string, quizId: number, sessionId: number) => {
  requestSessionStateUpdate(token, quizId, sessionId, sessionAction.NEXT_QUESTION);
};

const goToQuestionOpen = (token: string, quizId: number, sessionId: number) => {
  requestSessionStateUpdate(token, quizId, sessionId, sessionAction.NEXT_QUESTION);
  requestSessionStateUpdate(token, quizId, sessionId, sessionAction.SKIP_COUNTDOWN);
};

const goToQuestionClose = (token: string, quizId: number, sessionId: number) => {
  requestSessionStateUpdate(token, quizId, sessionId, sessionAction.NEXT_QUESTION);
  requestSessionStateUpdate(token, quizId, sessionId, sessionAction.SKIP_COUNTDOWN);
  sleepSync(VALID_Q_BODY_1.duration * 1000 + 1000);
};

const goToAnswerShow = (token: string, quizId: number, sessionId: number) => {
  requestSessionStateUpdate(token, quizId, sessionId, sessionAction.NEXT_QUESTION);
  requestSessionStateUpdate(token, quizId, sessionId, sessionAction.SKIP_COUNTDOWN);
  requestSessionStateUpdate(token, quizId, sessionId, sessionAction.GO_TO_ANSWER);
};

const goToFinalResults = (token: string, quizId: number, sessionId: number) => {
  requestSessionStateUpdate(token, quizId, sessionId, sessionAction.NEXT_QUESTION);
  requestSessionStateUpdate(token, quizId, sessionId, sessionAction.SKIP_COUNTDOWN);
  requestSessionStateUpdate(token, quizId, sessionId, sessionAction.GO_TO_ANSWER);
  requestSessionStateUpdate(token, quizId, sessionId, sessionAction.GO_TO_FINAL_RESULTS);
};

const goToEnd = (token: string, quizId: number, sessionId: number) => {
  requestSessionStateUpdate(token, quizId, sessionId, sessionAction.END);
};

afterEach(() => {
  requestClear();
});

describe('Tests for /v1/admin/quiz/{quizid}/session/{sessionid}', () => {
  beforeEach(() => {
    requestClear();
    user = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    quiz1 = requestQuizCreate(user.token, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
    quiz2 = requestQuizCreate(user.token, validDetails.QUIZ_NAME_2, validDetails.DESCRIPTION_2);
    requestQuizQuestionCreate(user.token, quiz1.quizId, VALID_Q_BODY_1);
    requestQuizQuestionCreate(user.token, quiz1.quizId, VALID_Q_BODY_2);
    requestQuizQuestionCreate(user.token, quiz2.quizId, VALID_Q_BODY_1);
    session1 = requestQuizSessionStart(user.token, quiz1.quizId, validAutoStartNum);
    session2 = requestQuizSessionStart(user.token, quiz2.quizId, validAutoStartNum);
    noQuizzesUser = requestAuthRegister(validDetails.EMAIL_2, validDetails.PASSWORD_2, validDetails.FIRST_NAME_2, validDetails.LAST_NAME_2);
  });

  describe('Success Cases', () => {
    test('NEXT_QUESTION: LOBBY -> QUESTION_COUNTDOWN', () => {
      goToQuestionCountdown(user.token, quiz1.quizId, session1.sessionId);
      expect(requestSessionStatus(user.token, quiz1.quizId, session1.sessionId).state).toStrictEqual(sessionState.QUESTION_COUNTDOWN);
    });

    test('Wait 3 seconds: QUESTION_COUNTDOWN -> QUESTION_OPEN', () => {
      goToQuestionCountdown(user.token, quiz1.quizId, session1.sessionId);
      sleepSync(4000);
      expect(requestSessionStatus(user.token, quiz1.quizId, session1.sessionId).state).toStrictEqual(sessionState.QUESTION_OPEN);
    });

    test('SKIP_COUNTDOWN: QUESTION_COUNTDOWN -> QUESTION_OPEN', () => {
      goToQuestionCountdown(user.token, quiz1.quizId, session1.sessionId);
      requestSessionStateUpdate(user.token, quiz1.quizId, session1.sessionId, sessionAction.SKIP_COUNTDOWN);
      expect(requestSessionStatus(user.token, quiz1.quizId, session1.sessionId).state).toStrictEqual(sessionState.QUESTION_OPEN);
    });

    test('Wait question duration: QUESTION_OPEN -> QUESTION_CLOSE', () => {
      goToQuestionOpen(user.token, quiz1.quizId, session1.sessionId);
      sleepSync(VALID_Q_BODY_1.duration * 1000 + 1000);
      expect(requestSessionStatus(user.token, quiz1.quizId, session1.sessionId).state).toStrictEqual(sessionState.QUESTION_CLOSE);
    });

    test('GO_TO_ANSWER: QUESTION_OPEN -> ANSWER_SHOW', () => {
      goToQuestionOpen(user.token, quiz1.quizId, session1.sessionId);
      requestSessionStateUpdate(user.token, quiz1.quizId, session1.sessionId, sessionAction.GO_TO_ANSWER);
      expect(requestSessionStatus(user.token, quiz1.quizId, session1.sessionId).state).toStrictEqual(sessionState.ANSWER_SHOW);
    });

    test('GO_TO_ANSWER: QUESTION_CLOSE -> ANSWER_SHOW', () => {
      goToQuestionClose(user.token, quiz1.quizId, session1.sessionId);
      requestSessionStateUpdate(user.token, quiz1.quizId, session1.sessionId, sessionAction.GO_TO_ANSWER);
      expect(requestSessionStatus(user.token, quiz1.quizId, session1.sessionId).state).toStrictEqual(sessionState.ANSWER_SHOW);
    });

    test('NEXT_QUESTION: QUESTION_CLOSE -> QUESTION_COUNTDOWN', () => {
      goToQuestionClose(user.token, quiz1.quizId, session1.sessionId);
      requestSessionStateUpdate(user.token, quiz1.quizId, session1.sessionId, sessionAction.NEXT_QUESTION);
      expect(requestSessionStatus(user.token, quiz1.quizId, session1.sessionId).state).toStrictEqual(sessionState.QUESTION_COUNTDOWN);
    });

    test('NEXT_QUESTION: ANSWER_SHOW -> QUESTION_COUNTDOWN', () => {
      goToAnswerShow(user.token, quiz1.quizId, session1.sessionId);
      requestSessionStateUpdate(user.token, quiz1.quizId, session1.sessionId, sessionAction.NEXT_QUESTION);
      expect(requestSessionStatus(user.token, quiz1.quizId, session1.sessionId).state).toStrictEqual(sessionState.QUESTION_COUNTDOWN);
    });

    test('GO_TO_FINAL_RESULTS: QUESTION_CLOSE -> FINAL_RESULTS', () => {
      goToQuestionClose(user.token, quiz1.quizId, session1.sessionId);
      requestSessionStateUpdate(user.token, quiz1.quizId, session1.sessionId, sessionAction.GO_TO_FINAL_RESULTS);
      expect(requestSessionStatus(user.token, quiz1.quizId, session1.sessionId).state).toStrictEqual(sessionState.FINAL_RESULTS);
    });

    test('GO_TO_FINAL_RESULTS: ANSWER_SHOW -> FINAL_RESULTS', () => {
      goToAnswerShow(user.token, quiz1.quizId, session1.sessionId);
      requestSessionStateUpdate(user.token, quiz1.quizId, session1.sessionId, sessionAction.GO_TO_FINAL_RESULTS);
      expect(requestSessionStatus(user.token, quiz1.quizId, session1.sessionId).state).toStrictEqual(sessionState.FINAL_RESULTS);
    });

    test('END: LOBBY -> END', () => {
      requestSessionStateUpdate(user.token, quiz1.quizId, session1.sessionId, sessionAction.END);
      expect(requestSessionStatus(user.token, quiz1.quizId, session1.sessionId).state).toStrictEqual(sessionState.END);
    });

    test('END: QUESTION_COUNTDOWN -> END', () => {
      goToQuestionCountdown(user.token, quiz1.quizId, session1.sessionId);
      requestSessionStateUpdate(user.token, quiz1.quizId, session1.sessionId, sessionAction.END);
      expect(requestSessionStatus(user.token, quiz1.quizId, session1.sessionId).state).toStrictEqual(sessionState.END);
    });

    test('END: QUESTION_OPEN -> END', () => {
      goToQuestionOpen(user.token, quiz1.quizId, session1.sessionId);
      requestSessionStateUpdate(user.token, quiz1.quizId, session1.sessionId, sessionAction.END);
      expect(requestSessionStatus(user.token, quiz1.quizId, session1.sessionId).state).toStrictEqual(sessionState.END);
    });

    test('END: QUESTION_CLOSE -> END', () => {
      goToQuestionClose(user.token, quiz1.quizId, session1.sessionId);
      requestSessionStateUpdate(user.token, quiz1.quizId, session1.sessionId, sessionAction.END);
      expect(requestSessionStatus(user.token, quiz1.quizId, session1.sessionId).state).toStrictEqual(sessionState.END);
    });

    test('END: ANSWER_SHOW -> END', () => {
      goToAnswerShow(user.token, quiz1.quizId, session1.sessionId);
      requestSessionStateUpdate(user.token, quiz1.quizId, session1.sessionId, sessionAction.END);
      expect(requestSessionStatus(user.token, quiz1.quizId, session1.sessionId).state).toStrictEqual(sessionState.END);
    });

    test('END: FINAL_RESULTS -> END', () => {
      goToFinalResults(user.token, quiz1.quizId, session1.sessionId);
      requestSessionStateUpdate(user.token, quiz1.quizId, session1.sessionId, sessionAction.END);
      expect(requestSessionStatus(user.token, quiz1.quizId, session1.sessionId).state).toStrictEqual(sessionState.END);
    });
  });

  describe('Error Cases', () => {
    describe('Normal error cases', () => {
      test('Session Id does not refer to a valid session within this quiz', () => {
        expect(() => requestSessionStateUpdate(user.token, quiz1.quizId, session2.sessionId, sessionAction.NEXT_QUESTION)).toThrow(HTTPError[400]);
      });

      test('Action provided is not a valid Action enum', () => {
        expect(() => requestSessionStateUpdate(user.token, quiz1.quizId, session1.sessionId, '')).toThrow(HTTPError[400]);
      });

      test('Token is empty', () => {
        expect(() => requestSessionStateUpdate('', quiz1.quizId, session1.sessionId, sessionAction.NEXT_QUESTION)).toThrow(HTTPError[401]);
      });

      test('Token is invalid', () => {
        expect(() => requestSessionStateUpdate(user.token + 1, quiz1.quizId, session1.sessionId, sessionAction.NEXT_QUESTION)).toThrow(HTTPError[401]);
      });

      test('Valid token is provided, but user is not an owner of this quiz', () => {
        expect(() => requestSessionStateUpdate(noQuizzesUser.token, quiz1.quizId, session1.sessionId, sessionAction.NEXT_QUESTION)).toThrow(HTTPError[403]);
      });
    });

    describe('LOBBY error cases', () => {
      test('SKIP_COUNTDOWN on LOBBY state', () => {
        expect(() => requestSessionStateUpdate(user.token, quiz1.quizId, session1.sessionId, sessionAction.SKIP_COUNTDOWN)).toThrow(HTTPError[400]);
      });

      test('GO_TO_ANSWER on LOBBY state', () => {
        expect(() => requestSessionStateUpdate(user.token, quiz1.quizId, session1.sessionId, sessionAction.GO_TO_ANSWER)).toThrow(HTTPError[400]);
      });

      test('GO_TO_FINAL_RESULTS on LOBBY state', () => {
        expect(() => requestSessionStateUpdate(user.token, quiz1.quizId, session1.sessionId, sessionAction.GO_TO_FINAL_RESULTS)).toThrow(HTTPError[400]);
      });
    });

    describe('QUESTION_COUNTDOWN error cases', () => {
      beforeEach(() => {
        goToQuestionCountdown(user.token, quiz1.quizId, session1.sessionId);
      });

      test('NEXT_QUESTION on QUESTION_COUNTDOWN state', () => {
        expect(() => requestSessionStateUpdate(user.token, quiz1.quizId, session1.sessionId, sessionAction.NEXT_QUESTION)).toThrow(HTTPError[400]);
      });

      test('GO_TO_ANSWER on QUESTION_COUNTDOWN state', () => {
        expect(() => requestSessionStateUpdate(user.token, quiz1.quizId, session1.sessionId, sessionAction.GO_TO_ANSWER)).toThrow(HTTPError[400]);
      });

      test('GO_TO_FINAL_RESULTS on QUESTION_COUNTDOWN state', () => {
        expect(() => requestSessionStateUpdate(user.token, quiz1.quizId, session1.sessionId, sessionAction.GO_TO_FINAL_RESULTS)).toThrow(HTTPError[400]);
      });
    });

    describe('QUESTION_OPEN error cases', () => {
      beforeEach(() => {
        goToQuestionOpen(user.token, quiz1.quizId, session1.sessionId);
      });

      test('NEXT_QUESTION on QUESTION_OPEN state', () => {
        expect(() => requestSessionStateUpdate(user.token, quiz1.quizId, session1.sessionId, sessionAction.NEXT_QUESTION)).toThrow(HTTPError[400]);
      });

      test('SKIP_COUNTDOWN on QUESTION_OPEN state', () => {
        expect(() => requestSessionStateUpdate(user.token, quiz1.quizId, session1.sessionId, sessionAction.SKIP_COUNTDOWN)).toThrow(HTTPError[400]);
      });

      test('GO_TO_FINAL_RESULTS on QUESTION_OPEN state', () => {
        expect(() => requestSessionStateUpdate(user.token, quiz1.quizId, session1.sessionId, sessionAction.GO_TO_FINAL_RESULTS)).toThrow(HTTPError[400]);
      });
    });

    describe('QUESTION_CLOSE error cases', () => {
      beforeEach(() => {
        goToQuestionClose(user.token, quiz1.quizId, session1.sessionId);
      });

      test('SKIP_COUNTDOWN on QUESTION_CLOSE state', () => {
        expect(() => requestSessionStateUpdate(user.token, quiz1.quizId, session1.sessionId, sessionAction.SKIP_COUNTDOWN)).toThrow(HTTPError[400]);
      });
    });

    describe('ANSWER_SHOW error cases', () => {
      beforeEach(() => {
        goToAnswerShow(user.token, quiz1.quizId, session1.sessionId);
      });

      test('SKIP_COUNTDOWN on ANSWER_SHOW state', () => {
        expect(() => requestSessionStateUpdate(user.token, quiz1.quizId, session1.sessionId, sessionAction.SKIP_COUNTDOWN)).toThrow(HTTPError[400]);
      });

      test('GO_TO_ANSWER on ANSWER_SHOW state', () => {
        expect(() => requestSessionStateUpdate(user.token, quiz1.quizId, session1.sessionId, sessionAction.GO_TO_ANSWER)).toThrow(HTTPError[400]);
      });
    });

    describe('FINAL_RESULTS error cases', () => {
      beforeEach(() => {
        goToFinalResults(user.token, quiz1.quizId, session1.sessionId);
      });

      test('NEXT_QUESTION on FINAL_RESULTS state', () => {
        expect(() => requestSessionStateUpdate(user.token, quiz1.quizId, session1.sessionId, sessionAction.NEXT_QUESTION)).toThrow(HTTPError[400]);
      });

      test('SKIP_COUNTDOWN on FINAL_RESULTS state', () => {
        expect(() => requestSessionStateUpdate(user.token, quiz1.quizId, session1.sessionId, sessionAction.SKIP_COUNTDOWN)).toThrow(HTTPError[400]);
      });

      test('GO_TO_ANSWER on FINAL_RESULTS state', () => {
        expect(() => requestSessionStateUpdate(user.token, quiz1.quizId, session1.sessionId, sessionAction.GO_TO_ANSWER)).toThrow(HTTPError[400]);
      });

      test('GO_TO_FINAL_RESULTS on FINAL_RESULTS state', () => {
        expect(() => requestSessionStateUpdate(user.token, quiz1.quizId, session1.sessionId, sessionAction.GO_TO_FINAL_RESULTS)).toThrow(HTTPError[400]);
      });
    });

    describe('END error cases', () => {
      beforeEach(() => {
        goToEnd(user.token, quiz1.quizId, session1.sessionId);
      });

      test('NEXT_QUESTION on END state', () => {
        expect(() => requestSessionStateUpdate(user.token, quiz1.quizId, session1.sessionId, sessionAction.NEXT_QUESTION)).toThrow(HTTPError[400]);
      });

      test('SKIP_COUNTDOWN on END state', () => {
        expect(() => requestSessionStateUpdate(user.token, quiz1.quizId, session1.sessionId, sessionAction.SKIP_COUNTDOWN)).toThrow(HTTPError[400]);
      });

      test('GO_TO_ANSWER on END state', () => {
        expect(() => requestSessionStateUpdate(user.token, quiz1.quizId, session1.sessionId, sessionAction.GO_TO_ANSWER)).toThrow(HTTPError[400]);
      });

      test('GO_TO_FINAL_RESULTS on END state', () => {
        expect(() => requestSessionStateUpdate(user.token, quiz1.quizId, session1.sessionId, sessionAction.GO_TO_FINAL_RESULTS)).toThrow(HTTPError[400]);
      });

      test('END on END state', () => {
        expect(() => requestSessionStateUpdate(user.token, quiz1.quizId, session1.sessionId, sessionAction.END)).toThrow(HTTPError[400]);
      });
    });
  });
});
