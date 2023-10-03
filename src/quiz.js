import { getData, setData } from './dataStore.js' 

export function getUser(userId) {
    const data = getData();
    return data.users.find(u => u.userId === userId);
}


export function getQuiz(quizId) {
    const data = getData();
    return data.quizzes.find(q => q.quizId === quizId);
}

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


/**
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
    name: user.name,
    timeCreated: user.timeCreated,
    timeLastEdited: user.timeLastEdited,
    description: quiz.description,
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
