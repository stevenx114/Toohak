import {
  setData,
  DataStore
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
    sessions: []
  };

  setData(data);

  return {};
};
