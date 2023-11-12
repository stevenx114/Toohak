import {
  getData,
  Quiz,
  User,
  Question,
  Session,
  sessions,
} from './dataStore';

export const getUser = (userId: number): User | undefined => {
  const data = getData();
  return data.users.find(u => u.userId === userId);
};

export const getQuiz = (quizId: number): Quiz | undefined => {
  const data = getData();
  return data.quizzes.find(q => q.quizId === quizId);
};

export const getToken = (sessionId: string): Token | undefined => {
  const data = getData();
  return data.tokens.find(t => t.sessionId === sessionId);
};

export const getUserByEmail = (email: string): User | undefined => {
  const data = getData();
  return data.users.find(u => u.email === email);
};

export const getQuestion = (quizId: number, questionId: number): Question | undefined => {
  const quiz = getQuiz(quizId);
  return quiz.questions.find(q => q.questionId === questionId);
};

export const getSession = (sessionId: number): Session | undefined => {
  return sessions.find(s => s.sessionId === sessionId);
};

export enum validDetails {
  EMAIL = 'sample@gmail.com',
  PASSWORD = 'samplepassword1',
  FIRST_NAME = 'firstname',
  LAST_NAME = 'lastname',
  QUIZ_NAME = 'quizName',
  DESCRIPTION = 'description',
  EMAIL_2 = 'sample2@gmail.com',
  PASSWORD_2 = 'password2',
  FIRST_NAME_2 = 'first',
  LAST_NAME_2 = 'last',
  QUIZ_NAME_2 = 'quiz',
  DESCRIPTION_2 = 'description2',
}

export interface ErrorObject {
  error: string;
  statusCode?: number;
}

export interface TokenReturn {
  token: string;
}

export interface trashQuizData {
  quizId: number,
  name: string,
}

export interface trashedQuizReturn {
  quizzes: trashQuizData[];
}

export interface UserDetailsReturn {
  user: {
      userId: number,
      name: string,
      email: string,
      numSuccessfulLogins: number,
      numFailedPasswordsSinceLastLogin: number
  }
}

export interface QuizIdReturn {
  quizId: number;
}

export interface QuizSimple {
  quizId: number;
  name: string;
}

export interface QuizListReturn {
  quizzes: QuizSimple[];
}

export interface AnswerSimple {
  answer: string;
  correct: true | false;
}

export interface QuestionBody {
  question: string;
  duration: number;
  points: number;
  answers: AnswerSimple[];
}

export interface QuestionIdReturn {
  questionId: number;
}

export interface QuestionDuplicateReturn {
  newQuestionId: number;
}

export type EmptyObject = Record<string, string>;

export interface questionAnswer {
  answer: string;
  correct: boolean;
}

export interface questionBody {
  question: string;
  duration: number;
  points: number,
  answers: questionAnswer[];
}

export interface PlayerIdReturn {
  playerId: number;
}
