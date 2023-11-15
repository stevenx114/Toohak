import {
    getData,
    Quiz,
    User,
    Question,
    Token
  } from './dataStore';
  
  import crypto from 'crypto';
  
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
  
  export const getUserByEmail = (email: string): User | undefined => {
    const data = getData();
    return data.users.find(u => u.email === email);
  };
  
  export const getQuestion = (quizId: number, questionId: number): Question | undefined => {
    const quiz = getQuiz(quizId);
    return quiz.questions.find(q => q.questionId === questionId);
  };
  
  export function getHashOf(password: string) {
    return crypto.createHash('sha256').update(password).digest('hex');
  }
  