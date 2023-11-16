import {
  getData,
  Quiz,
  User,
  Question,
  Token,
  Session,
  getTimerData,
  setTimerData,
  Timer,
  setData
} from './dataStore';

import {
  SessionState,
  SessionAction
} from './types';

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

export const getSession = (sessionId: number): Session | undefined => {
  const data = getData();
  return data.sessions.find(session => session.sessionId === sessionId);
};

export const getHashOf = (password: string): string => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

export const sleepSync = (ms: number) => {
  const startTime = new Date().getTime();
  while (new Date().getTime() - startTime < ms) {
    // zzzZZ - comment needed so eslint doesn't complain
  }
};

export const isValidAction = (state: string, action: string): boolean => {
  if (state === SessionState.LOBBY) {
    if (action === SessionAction.SKIP_COUNTDOWN ||
        action === SessionAction.GO_TO_ANSWER ||
        action === SessionAction.GO_TO_FINAL_RESULTS) {
      return false;
    }
  } else if (state === SessionState.QUESTION_COUNTDOWN) {
    if (action === SessionAction.NEXT_QUESTION ||
        action === SessionAction.GO_TO_ANSWER ||
        action === SessionAction.GO_TO_FINAL_RESULTS) {
      return false;
    }
  } else if (state === SessionState.QUESTION_OPEN) {
    if (action === SessionAction.NEXT_QUESTION ||
        action === SessionAction.SKIP_COUNTDOWN ||
        action === SessionAction.GO_TO_FINAL_RESULTS) {
      return false;
    }
  } else if (state === SessionState.QUESTION_CLOSE) {
    if (action === SessionAction.SKIP_COUNTDOWN) {
      return false;
    }
  } else if (state === SessionState.ANSWER_SHOW) {
    if (action === SessionAction.SKIP_COUNTDOWN ||
        action === SessionAction.GO_TO_ANSWER) {
      return false;
    }
  } else if (state === SessionState.FINAL_RESULTS) {
    if (action === SessionAction.NEXT_QUESTION ||
        action === SessionAction.SKIP_COUNTDOWN ||
        action === SessionAction.GO_TO_ANSWER ||
        action === SessionAction.GO_TO_FINAL_RESULTS) {
      return false;
    }
  } else if (state === SessionState.END) {
    return false;
  }
  return true;
};

const startCountdown = (sessionId: number) => {
  const data = getData();
  const timerData: Timer[] = getTimerData();
  const curSession = getSession(sessionId);
  const timeoutId: ReturnType<typeof setTimeout> = setTimeout(() => {
    curSession.state = SessionState.QUESTION_OPEN;
    setData(data);
  }, 3000);
  const newTimer: Timer = {
    timeoutId: timeoutId,
    sessionId: sessionId
  };
  timerData.push(newTimer);
  setTimerData(timerData);
};

const clearCountdown = (sessionId: number) => {
  const timerData: Timer[] = getTimerData();
  const timer = timerData.find(timer => timer.sessionId === sessionId);
  clearTimeout(timer.timeoutId);
  const indexOfTimer = timerData.findIndex(timer => timer.sessionId === sessionId);
  timerData.splice(indexOfTimer, 1);
  setTimerData(timerData);
};

export const getNextState = (sessionId: number, state: string, action: string): string => {
  let newState: string = state;

  if (action === SessionAction.END) {
    newState = SessionState.END;
  } else if (state === SessionState.LOBBY && action === SessionAction.NEXT_QUESTION) {
    newState = SessionState.QUESTION_COUNTDOWN;
    startCountdown(sessionId);
  } else if (state === SessionState.QUESTION_COUNTDOWN && action === SessionAction.SKIP_COUNTDOWN) {
    clearCountdown(sessionId);
    newState = SessionState.QUESTION_OPEN;
  } else if (state === SessionState.QUESTION_OPEN && action === SessionAction.GO_TO_ANSWER) {
    newState = SessionState.ANSWER_SHOW;
  } else if (state === SessionState.QUESTION_CLOSE) {
    if (action === SessionAction.GO_TO_ANSWER) {
      newState = SessionState.ANSWER_SHOW;
    } else if (action === SessionAction.NEXT_QUESTION) {
      newState = SessionState.QUESTION_COUNTDOWN;
      startCountdown(sessionId);
    } else if (action === SessionAction.GO_TO_FINAL_RESULTS) {
      newState = SessionState.FINAL_RESULTS;
    }
  } else if (state === SessionState.ANSWER_SHOW) {
    if (action === SessionAction.NEXT_QUESTION) {
      newState = SessionState.QUESTION_COUNTDOWN;
      startCountdown(sessionId);
    } else if (action === SessionAction.GO_TO_FINAL_RESULTS) {
      newState = SessionState.FINAL_RESULTS;
    }
  }
  return newState;
};
