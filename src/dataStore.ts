import { readFileSync, writeFileSync } from 'fs';

export interface Answer {
  answerId: number;
  answer: string;
  colour: string;
  correct: boolean;
}

export interface Question {
  questionId: number;
  question: string;
  duration: number;
  points: number;
  answers: Answer[];
  thumbnailUrl: string;
}

export interface User {
  userId: number;
  name: string;
  email: string;
  password: string;
  numSuccessfulLogins: number;
  numFailedPasswordsSinceLastLogin: number;
  quizzesOwned: number[];
  previousPasswords?: string[];
}

export interface Quiz {
  quizId: number;
  name: string;
  timeCreated: number;
  timeLastEdited: number;
  description: string;
  numQuestions?: number;
  questions?: Question[];
  duration?: number;
  thumbnailUrl?: string;
}

export interface Token {
  sessionId: string;
  authUserId: number;
}

export interface DataStore {
  users: User[];
  quizzes: Quiz[];
  tokens?: Token[];
  trash?: Quiz[];
  sessions?: Session[];
  players?: Player[];
}

export interface Player {
  playerId: number;
  score: number;
  name: string;
  sessionId: number;
  questionsCorrect: boolean[];
  answerTime: number[];
}

export interface Session {
  sessionId: number;
  quizId: number;
  quiz: Quiz;
  atQuestion: number;
  questionStartTime?: number;
  state: string;
  numPlayers: number;
  players: Player[];
  autoStartNum: number;
  chat?: object[];
}

export interface Timer {
  timeoutId: ReturnType<typeof setTimeout>;
  sessionId: number;
}

let timerData: Timer[] = [];

export const getTimerData = (): Timer[] => timerData;

export const setTimerData = (newTimerData: Timer[]) => {
  timerData = newTimerData;
};

let data: DataStore = {
  users: [],
  quizzes: [],
  tokens: [],
  trash: [],
  sessions: [],
  players: []
};

import request, { HttpVerb } from 'sync-request';

const DEPLOYED_URL = "https://z5481988-toohak-deploy.vercel.app"

const requestHelper = (method: HttpVerb, path: string, payload: object) => {
  let json = {};
  let qs = {};
  if (['GET', 'DELETE'].includes(method)) {
    qs = payload;
  } else {
    json = payload;
  }

  const res = request(method, DEPLOYED_URL + path, { qs, json, timeout: 20000 });
  return JSON.parse(res.body.toString());
};

export const getData = (): Data => {
  try {
    const res = requestHelper('GET', '/data', {});
    return res.data;
  } catch (e) {
    return {
      users: [],
      quizzes: [],
      tokens: [],
      trash: [],
      sessions: [],
      players: []
    };
  }
};

export const setData = (newData: Data) => {
  requestHelper('PUT', '/data', { data: newData });
};
