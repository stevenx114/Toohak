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
  previousPasswords?: string[];
}

export interface Quiz {
  quizId: number;
  name: string;
  timeCreated: number;
  timeLastEdited: number;
  description: string;
<<<<<<< HEAD
  numQuestions: number;
  questions: Question[];
=======
  numQuestions?: number;
  questions?: Question[];
  duration?: number;
>>>>>>> 9761e25ebbc12b376c6be418396e043d8d6eed56
}

export interface Token {
  sessionId: string;
  authUserId: number;
<<<<<<< HEAD
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
=======
>>>>>>> 9761e25ebbc12b376c6be418396e043d8d6eed56
}

export interface DataStore {
  users: User[];
  quizzes: Quiz[];
<<<<<<< HEAD
  tokens: Token[];
=======
  tokens?: Token[];
  trash?: Quiz[];
>>>>>>> 9761e25ebbc12b376c6be418396e043d8d6eed56
}

let data: DataStore = {
  users: [],
  quizzes: [],
<<<<<<< HEAD
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
=======
  tokens: [],
  trash: [],
};
>>>>>>> 9761e25ebbc12b376c6be418396e043d8d6eed56

// Use get() to access the data
export const getData = (): DataStore => data;

// Use set(newData) to pass in the entire data object, with modifications made
export const setData = (newData: DataStore) => { data = newData; };