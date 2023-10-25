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

export type QuestionBody = {
  question: string, 
  duration: number,
  points: number, 
  answers: Answer[]
}

export type Answer = {
  answer: string,
  correct: boolean,
}
