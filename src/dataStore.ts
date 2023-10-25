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
  points: number,
  answers: Answer[];
}

export interface User {
  userId: number;
  name: string;
  email: string;
  password: string;
  numSuccessfulLogins: number;
  numFailedPasswordsSinceLastLogin: number;
  quizzesOwned: number[];
}

export interface Quiz {
  onwerId: number;
  quizId: number;
  name: string;
  timeCreated: number;
  timeLastEdited: number;
  description: string;
  numQuestions: number;
  questions: Question[];
}

export interface Token {
  sessionId: number;
  authUserId: number;
}

export interface Token {
  sessionId: string;
  authUserId: number;
}

export interface DataStore {
  users: User[];
  quizzes: Quiz[];
  tokens: Token[];
<<<<<<< HEAD
=======
  trash: Quiz[];
>>>>>>> 777c5eabb329b82d19f89f252a914b8e974a29ec
}

let data: DataStore = {
  users: [],
  quizzes: [],
<<<<<<< HEAD
  tokens: []
=======
  tokens: [],
  trash: []
>>>>>>> 777c5eabb329b82d19f89f252a914b8e974a29ec
};

// Use get() to access the data
export const getData = (): DataStore => data;

// Use set(newData) to pass in the entire data object, with modifications made
export const setData = (newData: DataStore) => { data = newData; };
