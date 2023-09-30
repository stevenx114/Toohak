/**
 * Resets the state of the application back to the initial state, clearing all data.
 *
 * @returns {Object} An empty object.
 */
export function clear() {
    
  // Clearing
  data = {
    users: [],
    quizzes: [],
  }

  return {};
}