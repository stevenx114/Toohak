import { 
  getData, 
  setData 
} from './dataStore';

import { 
  v4 as uuidv4 
} from 'uuid';

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
function adminQuizCreate(authUserId, name, description) {
  return {
      quizId: 2,
  }
}

/**
 * Given a particular quiz, permanently remove the quiz.
 *
 * @param {number} authUserId of integers
 * @param {number} quizId of integers
 * @returns {object} empty object
 */
function adminQuizRemove(authUserId, quizId ) {
    return { 
    }
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

/*
Parameters:
  ( authUserId, quizId )

Return object:
  {
    quizId: 1,
    name: 'My Quiz',
    timeCreated: 1683125870,
    timeLastEdited: 1683125871,
    description: 'This is my quiz',
  }

Gets and returns all of the relevant information about the current quiz.
*/
function adminQuizInfo(authUserId, quizId) {
  return {
      quizId: 1,
      name: 'My Quiz',
      timeCreated: 1683125870,
      timeLastEdited: 1683125871,
      description: 'This is my quiz',       
  }
}

/*
 Provide a list of all quizzes that are owned by the currently logged in user.

 Input Parameters:
 ( authUserId )

 Return: 

{ quizzes: [
    {
      quizId: 1,
      name: 'My Quiz',
    }
    ]
 } 
*/
function adminQuizList(authUserId) {

    return { quizzes: [
        {
          quizId: 1,
          name: 'My Quiz',
        }
      ]
    };

}