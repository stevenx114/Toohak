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
  correct: boolean;
}

export interface QuestionBody {
  question: string;
  duration: number;
  points: number;
  answers: AnswerSimple[];
  thumbnailUrl?: string;
}

export interface QuestionIdReturn {
  questionId: number;
}

export interface QuestionDuplicateReturn {
  newQuestionId: number;
}

export type EmptyObject = Record<string, string>;
