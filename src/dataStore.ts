// YOU SHOULD MODIFY THIS OBJECT BELOW
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

export interface Question {
  questionId: number;
  question: string;
  duration: number;
  points: number,
  answers: Answer[];
}

export interface Answer {
    answerId: number;
    answer: string;
    colour: string;
    correct: boolean;
}

export interface DataStore {
  users: User[];
  quizzes: Quiz[];
  tokens: Token[];
}

let data: DataStore = {
  users: [],
  quizzes: [],
  tokens: []
};
// YOU SHOULDNT NEED TO MODIFY THE FUNCTIONS BELOW IN ITERATION 1

/*
Example usage
    let store = getData()
    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Rando'] }

    names = store.names

    names.pop()
    names.push('Jake')

    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Jake'] }
    setData(store)
*/

// Use get() to access the data
export const getData = (): DataStore => data;

// Use set(newData) to pass in the entire data object, with modifications made
export const setData = (newData: DataStore) => { data = newData; };
