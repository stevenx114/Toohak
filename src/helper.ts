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
  setData,
  Player
} from './dataStore';

import {
  sessionState,
  sessionAction
} from './types';

import crypto from 'crypto';

const countdownLength = 3000;

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

export const getPlayer = (playerId: number): Player | undefined => {
  const data = getData();
  return data.players.find(p => p.playId === playerId);
}

export const getQuestion = (quizId: number, questionId: number): Question | undefined => {
  const quiz = getQuiz(quizId);
  return quiz.questions.find(q => q.questionId === questionId);
};

export const getSession = (sessionId: number): Session | undefined => {
  const data = getData();
  return data.sessions.find(session => session.sessionId === sessionId);
};

export const getPlayer = (playerId: number): Player | undefined => {
  const data = getData();
  return data.players.find(player => player.playerId === playerId);
};

export const getHashOf = (password: string): string => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

export const getSessionByPlayerId = (playerId: number): Session | undefined => {
  return getData().sessions.find(currSession => currSession.players.some(player => player.playerId === playerId));
};

export const sleepSync = (ms: number) => {
  /* istanbul ignore next */
  const startTime = new Date().getTime();
  /* istanbul ignore next */
  while (new Date().getTime() - startTime < ms) {
    // zzzZZ - comment needed so eslint doesn't complain
  }
};

export const isValidAction = (state: string, action: string): boolean => {
  if (state === sessionState.END) {
    return false;
  } else if (state === sessionState.LOBBY) {
    if (action === sessionAction.SKIP_COUNTDOWN ||
        action === sessionAction.GO_TO_ANSWER ||
        action === sessionAction.GO_TO_FINAL_RESULTS) {
      return false;
    }
  } else if (state === sessionState.QUESTION_COUNTDOWN) {
    if (action === sessionAction.NEXT_QUESTION ||
        action === sessionAction.GO_TO_ANSWER ||
        action === sessionAction.GO_TO_FINAL_RESULTS) {
      return false;
    }
  } else if (state === sessionState.QUESTION_OPEN) {
    if (action === sessionAction.NEXT_QUESTION ||
        action === sessionAction.SKIP_COUNTDOWN ||
        action === sessionAction.GO_TO_FINAL_RESULTS) {
      return false;
    }
  } else if (state === sessionState.QUESTION_CLOSE) {
    if (action === sessionAction.SKIP_COUNTDOWN) {
      return false;
    }
  } else if (state === sessionState.ANSWER_SHOW) {
    if (action === sessionAction.SKIP_COUNTDOWN ||
        action === sessionAction.GO_TO_ANSWER) {
      return false;
    }
  } else if (state === sessionState.FINAL_RESULTS) {
    if (action === sessionAction.NEXT_QUESTION ||
        action === sessionAction.SKIP_COUNTDOWN ||
        action === sessionAction.GO_TO_ANSWER ||
        action === sessionAction.GO_TO_FINAL_RESULTS) {
      return false;
    }
  }
  return true;
};

const startCountdown = (sessionId: number, newState: string, ms: number) => {
  const data = getData();
  const timerData: Timer[] = getTimerData();
  const curSession = getSession(sessionId);
  const timeoutId: ReturnType<typeof setTimeout> = setTimeout(() => {
    curSession.state = newState;
    setData(data);
  }, ms);
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

export const getNextState = (sessionId: number, state: string, action: string, questionDuration: number): string => {
  const data = getData();
  const curSession: Session = getSession(sessionId);
  let newState: string = state;

  if (action === sessionAction.END) {
    newState = sessionState.END;
  } else if (state === sessionState.LOBBY && action === sessionAction.NEXT_QUESTION) {
    newState = sessionState.QUESTION_COUNTDOWN;
    curSession.atQuestion++;
    startCountdown(sessionId, sessionState.QUESTION_OPEN, countdownLength);
  } else if (state === sessionState.QUESTION_COUNTDOWN && action === sessionAction.SKIP_COUNTDOWN) {
    clearCountdown(sessionId);
    newState = sessionState.QUESTION_OPEN;
    startCountdown(sessionId, sessionState.QUESTION_CLOSE, questionDuration * 1000);
  } else if (state === sessionState.QUESTION_OPEN && action === sessionAction.GO_TO_ANSWER) {
    newState = sessionState.ANSWER_SHOW;
  } else if (state === sessionState.QUESTION_CLOSE) {
    if (action === sessionAction.GO_TO_ANSWER) {
      newState = sessionState.ANSWER_SHOW;
    } else if (action === sessionAction.NEXT_QUESTION) {
      newState = sessionState.QUESTION_COUNTDOWN;
      curSession.atQuestion++;
      startCountdown(sessionId, sessionState.QUESTION_OPEN, countdownLength);
    } else if (action === sessionAction.GO_TO_FINAL_RESULTS) {
      newState = sessionState.FINAL_RESULTS;
    }
  } else if (state === sessionState.ANSWER_SHOW) {
    if (action === sessionAction.NEXT_QUESTION) {
      newState = sessionState.QUESTION_COUNTDOWN;
      curSession.atQuestion++;
      startCountdown(sessionId, sessionState.QUESTION_OPEN, countdownLength);
    } else if (action === sessionAction.GO_TO_FINAL_RESULTS) {
      newState = sessionState.FINAL_RESULTS;
    }
  }
  setData(data);
  return newState;
};
