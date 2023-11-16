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
  thumbnailUrl?: string;
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
}

const dataFilePath = 'data.json';

const readData = (): DataStore => {
  const fileContent = readFileSync(dataFilePath, 'utf8');
  return JSON.parse(fileContent) as DataStore;
};

const writeData = (data: DataStore) => {
  const dataToSave = JSON.stringify(data, null, 2);
  writeFileSync(dataFilePath, dataToSave, 'utf8');
};

let data: DataStore = readData();

export const getData = (): DataStore => data;

export const setData = (newData: DataStore) => {
  data = newData;
  writeData(data);
};
