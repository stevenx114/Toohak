import {
  Player,
  Quiz
} from './dataStore';

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

export enum sessionState {
  LOBBY = 'LOBBY',
  QUESTION_COUNTDOWN = 'QUESTION_COUNTDOWN',
  QUESTION_OPEN = 'QUESTION_OPEN',
  QUESTION_CLOSE = 'QUESTION_CLOSE',
  ANSWER_SHOW = 'ANSWER_SHOW',
  FINAL_RESULTS = 'FINAL_RESULTS',
  END = 'END'
}

export enum sessionAction {
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

export interface SessionIdReturn {
  sessionId: number;
}

export const VALID_Q_BODY: QuestionBody = {
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
  ],
  thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png'
};

export const VALID_Q_BODY_1: QuestionBody = {
  question: 'question2',
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
  ],
  thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png'
};

export const VALID_Q_BODY_2: QuestionBody = {
  question: 'question3',
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
  ],
  thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png'
};

export const VALID_Q_BODY_3: QuestionBody = {
  question: 'question4',
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
  ],
  thumbnailUrl: 'https://www.pngall.com/wp-content/uploads/2016/04/Potato-PNG-Clipart.png'
};

export interface SessionStatusViewReturn {
  state: string;
  atQuestion: number;
  players: Player[];
  metadata: Quiz;
}

interface UserScore {
  name: string;
  score: number;
}

export interface QuestionResults {
  questionId: number;
  playersCorrectList: string[];
  averageAnswerTime: number;
  percentCorrect: number;
}

export interface SessionResultsReturn {
  usersRankedByScore: UserScore[];
  questionResults: QuestionResults[];
}

export interface PlayerQuestionAnswer {
  answerId: number;
  answer: string;
  colour: string;
}

export interface PlayerQuestionInfoReturn {
  questionId: number;
  question: string;
  duration: number;
  thumbnailURL: string;
  points: number;
  answers: PlayerQuestionAnswer[];
}

export interface SessionList {
  activeSessions: number[],
  inactiveSessions: number[],
}

export interface PlayerIdReturn {
  playerId: number;
}

export interface PlayerStatusReturn {
  state: string,
  numQuestions: number,
  atQuestion: number
}

export interface SessionFinalResultsReturn {
  usersRankedByScore: UsersRankedByScore[];
  questionResults: QuestionResults[];
}

export interface UsersRankedByScore {
  name: string;
  score: number;
}

export interface MessageReturn {
  messageBody: string;
}

export interface PlayerChatSendReturn {
  message: MessageReturn;
}

export interface QuestionResult {
  questionId: number;
  playersCorrectList: string[];
  averageAnswerTime: number;
  percentCorrect: number;
}

export interface PlayerChatReturn {
  messages: Message[];
}

export interface Message {
  messageBody: string,
  playerId: number,
  playerName: string,
  timeSent: number
}
