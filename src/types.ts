import {
  getData,
  Quiz,
  User,
  Token
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

export enum validDetails {
  EMAIL = 'sample@gmail.com',
  PASSWORD = 'samplepassword1',
  FIRST_NAME = 'firstname',
  LAST_NAME = 'lastname',
  QUIZ_NAME = 'quizName',
  DESCRIPTION = 'description',
<<<<<<< HEAD
  EMAIL_2 = 'sample@gmail2.com',
  PASSWORD_2 = 'password2',
  FIRST_NAME_2 = 'first2',
  LAST_NAME_2 = 'last2',
  QUIZ_NAME_2 = 'quiz2',
=======
  EMAIL_2 = 'sample2@gmail.com',
  PASSWORD_2 = 'password2',
  FIRST_NAME_2 = 'first',
  LAST_NAME_2 = 'last',
  QUIZ_NAME_2 = 'quiz',
>>>>>>> 9761e25ebbc12b376c6be418396e043d8d6eed56
  DESCRIPTION_2 = 'description2',
}

export interface ErrorObject {
  error: string;
<<<<<<< HEAD
  statusCode: number;
=======
  statusCode?: number;
>>>>>>> 9761e25ebbc12b376c6be418396e043d8d6eed56
}

export interface AuthUserIdReturn {
  authUserId: number;
}

export interface TokenReturn {
  token: string;
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

export interface TokenReturn {
  token: string;
}

export type EmptyObject = Record<string, string>;

export interface QuestionBody {
  question: string; 
  duration: number;
  points: number; 
  answers: Answer[];
}

export interface Question {
  questionid: number;
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