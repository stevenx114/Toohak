import { getData, setData } from './dataStore';
import { v4 as uuidv4 } from 'uuid';
import validator from 'validator';

export function getUser(userId) {
  const data = getData();
  return data.users.find(u => u.userId === userId);
}

export function getQuiz(quizId) {
  const data = getData();
  return data.quizzes.find(q => q.quizId === quizId);
}

/**
 * 
 *
 * Given basic details about a new quiz, create one for the logged in user.
 *
 * @param {number} authUserId 
 * @param {string} name 
 * @param {string} description 
 * @returns {object} quiz info
 */
export function adminQuizCreate(authUserId, name, description) {
  const data = getData();
  const specialChar = /[^a-zA-Z0-9\s]/;
  const userId = getUser(authUserId);

  if (!userId) {
    return {error: 'AuthUserId is not a valid user'};
  }
  
  if (!name) {
    return {error: 'name cannot be empty'};
  } else if (name.length < 3) {
    return {error: 'name needs to be at least 3 characters'};
  } else if (name.length > 30) {
    return {error: 'name cannot exceed 30 characters'};
  } else if (description.length > 100) {
    return {error: 'description cannot exceed 100 characters'};
  } else if (specialChar.test(name)) {
    return {error: 'name can only contain alphanumeric and space characters'};
  }
  
  for (let id in userId.quizzesOwned) {
    const quizIdOwned = userId.quizzesOwned[id];
    const quizInfo = getQuiz(quizIdOwned);
    if (quizInfo.name === name) {
      return { error: 'quiz name is already in use'};
    }
  }
  
  const newQuizId =  parseInt(uuidv4().replace(/-/g, ''), 16);

  data.quizzes.push(
    {
      quizId: newQuizId,
      name: name,
      timeCreated: Date.now(),
      timeLastEdited: Date.now(),
      description: description,
    }
  );

  userId.quizzesOwned.push(newQuizId); // Updates the quizzes owned by current user
  setData(data);

  return {
    quizId: newQuizId,
  }
}

/** 
 * Given a particular quiz, permanently remove the quiz.
 *
 * @param {number} authUserId of integers
 * @param {number} quizId of integers
 * @returns {object} empty object
 */

export function adminQuizRemove(authUserId, quizId) {
  const data = getData();
  const user = getUser(authUserId);
  if (!user) {
    return {
      error: 'AuthUserId is not a valid user'
    }
  }
  if (!getQuiz(quizId)) {
    return {
      error: 'Quiz ID does not refer to a valid quiz'
    }
  }
  if (!user.quizzesOwned.includes(quizId)) {
    return {
      error: 'Quiz ID does not refer to a quiz that this user owns'
    }
  }
  let indexOfQuiz;
  for (const quiz in data.quizzes) {
    if (data.quizzes[quiz].quizId === quizId) {
      indexOfQuiz = quiz;
    }
  }
  data.quizzes.splice(indexOfQuiz, 1);
  for (const quiz in user.quizzesOwned) {
    if (user.quizzesOwned[quiz] === quizId) {
      indexOfQuiz = quiz;
    }
  }
  user.quizzesOwned.splice(indexOfQuiz, 1);
  setData(data);
  return {};
}

// Updates the description of the relevant quiz
function adminQuizDescriptionUpdate(authUserId, quizId, description) {
    return {
        // Returns empty object
    }
}

/** 
 * Update the name of the relevant quiz.
 * 
 * @param {number} authUserId
 * @param {number} quizId
 * @param {string} name
 * @returns {} empty
 * @returns {string} error
 */
export function adminQuizNameUpdate(authUserId, quizId, name) {
  let data = getData();
  const curUser = getUser(authUserId);
  name = name.replace(/\s/g, '');

  if (!getUser(authUserId)) {
    return {
      error: 'AuthUserId is not a valid user'
    }
  } else if (!getQuiz(quizId)) {
    return {
      error: 'Quiz ID does not refer to a valid quiz'
    }
  } else if (!curUser.quizzesOwned.includes(quizId)) {
    return {
      error: 'Quiz ID does not refer to a quiz that this user owns'
    }
  } else if (!validator.isAlphanumeric(name)) {
    return {
      error: 'Name contains invalid characters. Valid characters are alphanumeric and spaces'
    }
  } else if (name.length < 3 || name.length > 30) {
    return {
      error: 'Name is either less than 3 characters long or more than 30 characters long'
    }
  } else if (data.quizzes.some(quiz => (quiz.name === name && curUser.quizzesOwned.includes(quiz.quizId)))) {
    return {
      error: 'Name is already used by the current logged in user for another quiz'
    }
  }
  getQuiz(quizId).name = name;
  getQuiz(quizId).timeLastEdited = Math.floor((new Date()).getTime() / 1000);
  setData(data);

  return {};
} 

/**
 * Get all of the relevant information about the current quiz.
 * 
 * @param {Number} authUserId 
 * @param {Number} quizId 
 * @returns {object} quiz info
 */
export function adminQuizInfo(authUserId, quizId) {
  const user = getUser(authUserId);
  const quiz = getQuiz(quizId);
  if (!user) {
      return { error: 'AuthUserId is not a valid user' };
  }

  if (!quiz) {
    return { error: 'Quiz ID does not refer to a valid quiz' };
  }

  if (!user.quizzesOwned.includes(quizId)) {
    return { error: 'Quiz ID does not refer to a quiz that this user owns' };
  }

  return {
    quizId: quiz.quizId,
    name: quiz.name,
    timeCreated: quiz.timeCreated,
    timeLastEdited: quiz.timeLastEdited,
    description: quiz.description,
  }
}

/**
 * 
 * Provide a list of all quizzes that are owned by the currently logged in user.
 * 
 * @param {number} authUserId 
 * @returns {Object} quizId
 * 
 */
export function adminQuizList(authUserId) {
  const data = getData();
  const userId = getUser(authUserId);
  const quizzes = [];
  
  if (!userId) {
    return { error: 'AuthUserId is not a valid user' };
  }
  
  for (const id in userId.quizzesOwned) {
    const quizList = userId.quizzesOwned[id]; // Array of quizzesOwned
    const quizInfo = getQuiz(quizList); // Find relevant quiz object
    quizzes.push(
      {
        quizId: quizInfo.quizId,
        name: quizInfo.name,
      }
    )
  }

  return {
    quizzes: quizzes,
  }
}
