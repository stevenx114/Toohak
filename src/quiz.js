/*
Parameters:
<<<<<<< src/quiz.js
   ( authUserId, quizId )
=======
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
 Provide a list of all quizzes that are owned by the currently logged in user.

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