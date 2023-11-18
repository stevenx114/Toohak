import {
  setData,
  DataStore,
  getTimerData,
  setTimerData,
  Timer
} from './dataStore';

import {
  EmptyObject
} from './types';

/**
   * Resets the state of the application back to the initial state, clearing all data.
   *
   * @returns {Object} An empty object.
   */
export const clear = (): EmptyObject => {
  const data: DataStore = {
    users: [],
    quizzes: [],
    tokens: [],
    trash: [],
    sessions: [],
    players: []
  };
  setData(data);

  let timerData: Timer[] = getTimerData();
  for (const timer of timerData) {
    clearTimeout(timer.timeoutId);
  }
  timerData = [];
  setTimerData(timerData);

  return {};
};
