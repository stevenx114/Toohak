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