import { getData, setData } from "./dataStore";
import { getUser, getQuiz } from "./types";
import { EmptyObject, ErrorObject } from "./types";

/**
 * Updates the description of the relevant quiz.
 *
 * @param {string} authUserId - The ID of the user making the update.
 * @param {string} quizId - The ID of the quiz to be updated.
 * @param {string} description - The new description for the quiz.
 *
 * @returns {object} An empty object.
 *
 * @throws {Error} If an error occurs.
 */
export const adminQuizDescriptionUpdate = (authUserId: number, quizId: number, description: string): EmptyObject | ErrorObject => {
  const data = getData();
  const user = getUser(authUserId);
  const quiz = getQuiz(quizId);

  if (description.length > 100) {
    return { error: 'Description is more than 100 characters in length' };
  }

  if (!user) {
    return { error: 'AuthUserId is not a valid user' };
  }

  if (!quiz) {
    return { error: 'Quiz ID does not refer to a valid quiz' };
  }

  const doesUserOwnQuiz = user.quizzesOwned.find(u => u === quizId);

  if (!doesUserOwnQuiz) {
    return { error: 'Quiz ID does not refer to a quiz that this user owns' };
  }

  quiz.description = description;
  quiz.timeLastEdited = Math.floor((new Date()).getTime() / 1000);
  setData(data);

  return {};
};