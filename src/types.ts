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

export enum SessionState {
  LOBBY = 'LOBBY',
  QUESTION_COUNTDOWN = 'QUESTION_COUNTDOWN',
  QUESTION_OPEN = 'QUESTION_OPEN',
  QUESTION_CLOSE = 'QUESTION_CLOSE',
  ANSWER_SHOW = 'ANSWER_SHOW',
  FINAL_RESULTS = 'FINAL_RESULTS',
  END = 'END'
}

export enum SessionAction {
  NEXT_QUESTION = 'NEXT_QUESTION',
  SKIP_COUNTDOWN = 'SKIP_COUNTDOWN',
  GO_TO_ANSWER = 'GO_TO_ANSWER',
  GO_TO_FINAL_RESULTS = 'GO_TO_FINAL_RESULTS',
  END = 'END'
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
  thumbnailUrl?: string;
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

export interface SessionIdReturn {
  sessionId: number;
}
