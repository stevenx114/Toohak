import {
  getData,
  Quiz,
  User
} from './dataStore';

export const getUser = (userId: number): User | undefined => {
  const data = getData();
  return data.users.find(u => u.userId === userId);
};

export const getQuiz = (quizId: number): Quiz | undefined => {
  const data = getData();
  return data.quizzes.find(q => q.quizId === quizId);
};

export const getToken = (token: number): Token | undefined => {
  const data = getData();
  return data.tokens.find(q => q.sessionId === token);
}

export enum validDetails {
  EMAIL = 'sample@gmail.com',
  PASSWORD = 'samplepassword1',
  FIRST_NAME = 'firstname',
  LAST_NAME = 'lastname',
  QUIZ_NAME = 'quizName',
  DESCRIPTION = 'description',
}

export interface ErrorObject {
  error: string;
}

export interface Token {
  token: string,
  userId: number
}

export interface AuthUserIdReturn {
  authUserId: number;
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

export type EmptyObject = Record<string, string>;

export interface QuestionBody {
  question: string; 
  duration: number;
  points: number; 
  answers: Answer[];
}

export interface Answer {
  answer: string;
  correct: true | false;
}

export interface QuestionId {
  questionId: number;
}