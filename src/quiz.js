import { getData, setData } from './dataStore';

export function getUser(authUserId) {
  const data = getData();
  return data.users.find(u => u.userId === authUserId);
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
  

}

/*
 * Given a particular quiz, permanently remove the quiz.
 *
 * @param {number} authUserId of integers
 * @param {number} quizId of integers
 * @returns {object} empty object
 */
export function adminQuizRemove(authUserId, quizId ) {
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
  const data = getData();
  const userId = getUser(authUserId);
  let quiz = [];
  
  if (!userId) {
    return { error: "AuthUserId is not a valid user" };
  }
  
  for (let id in userId.quizzesOwned) {
    const quizList = userId.quizzesOwned[id]; // Array of quizzesOwned
    const quizInfo = getQuiz(quizList); // Find relevant quiz object
    quiz.push(
      {
        quizId: quizInfo.quizId,
        name: quizInfo.name,
      }
    )
  }

  return { 
    quizzes: quiz,
  };

}
