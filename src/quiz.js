import {
  getData,
  setData,
} from './dataStore';

import {
  getUser,
  getQuiz,
} from './auth';

/**
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

/*
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
function adminQuizDescriptionUpdate(authUserId, quizId, description) {

  const data = getData();
  const user = getUser(authUserId);
  const quiz = getQuiz;

  if (description.length > 100) {
    return {error: 'Description is more than 100 characters in length'};
  }

  if (!user) {
    return {error: 'AuthUserId is not a valid user'};
  }

  if (!quiz) {
    return {error: 'Quiz ID does not refer to a valid quiz'};
  }
  
  const doesUserOwnQuiz = user.quizzesOwned(u => u === authUserId);

  if (!doesUserOwnQuiz) {
    return {error: 'Quiz ID does not refer to a quiz that this user owns'};
  }

  quiz.description = description;
  setData(data);
      
  return {};
}

/*
Parameters:
  ( authUserId, quizId, name )
      
Return object:
  { } empty object

Updates the name of the relevant quiz.
*/

function adminQuizNameUpdate(authUserId, quizId, name) {
    return {
        
    }
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
