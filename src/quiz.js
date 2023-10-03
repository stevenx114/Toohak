import { getData, setData } from './dataStore.js';

/**
 * Given basic details about a new quiz, create one for the logged in user.
 *
 * @param {number} authUserId 
 * @param {string} name 
 * @param {string} description 
 * @returns {object} quiz info
 */
export function adminQuizCreate(authUserId, name, description) {
  const dataBase = getData();

  if (!name) {
    return {error: "name cannot be empty"};
  } else if (name.length < 3) {
    return {error: "name needs to be at least 3 characters"};
  } else if (name.length > 30) {
    return {error: "name cannot exceed 30 characters"};
  } else if (description.length > 100) {
    return {error: "description cannot exceed 100 characters"};
  }

  const AuthUserIdToFind = dataBase.users.find(a => a.userId === userId);
  if (!AuthUserIdToFind) {
    return {error: "AuthUserId is not a valid user"};
  }

  const quizzes = (authUserId.length * name.length) + 342857;
  dataBase.quizzes.push(
    {
      quizId: Quizzes,
      name: name,
      timeCreated: Date.now(),
      timeLastEdited: Date.now(),
      description: description,
    }
  );

  return {
    quizId: quizzes,
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

export function adminQuizList(authUserId) {

    return { quizzes: [
        {
          quizId: 1,
          name: 'My Quiz',
        }
      ]
    };

}
