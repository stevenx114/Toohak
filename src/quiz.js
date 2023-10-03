import { getData, setData } from './dataStore.js';

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


// Updates the description of the relevant quiz
function adminQuizDescriptionUpdate(authUserId, quizId, description) {
    return {
        // Returns empty object
    }
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

/**
 * 
 * Provide a list of all quizzes that are owned by the currently logged in user.
 * 
 * @param {*} authUserId 
 * @returns 
 * 
 */

export function adminQuizList(authUserId) {
  const userId = getUser(authUserId);

  if (!userId) {
    return { error: "AuthUserId is not a valid user" };
  }

  const quizList = userId.quizzesOwned;
  let quizListArr = [];

  for (let quizId in quizList) {
    const currQuizId = getQuiz(quizList[quizId]);
    quizListArr.push(
      {
        quizId: currQuizId.quizId,
        name: currQuizId.name,
      },
    );
  }

  return { 
    quizzes: quizListArr,
  };

}
