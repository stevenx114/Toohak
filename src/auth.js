// Given a registered user's email and password returns their authUserId value.
function adminAuthLogin(email, password) {
    return {
        authUserId: 1,
    }
}

// Given an admin user's authUserId, return details about the user.
// "name" is the first and last name concatenated with a single space between them

// Input Parameters: ( authUserId )
      
// Return object:
//  { user:
// {
// userId: 1,
// name: 'Hayden Smith',
// email: 'hayden.smith@unsw.edu.au',
// numSuccessfulLogins: 3,
// numFailedPasswordsSinceLastLogin: 1,
// }
// 
// }

function adminUserDetails(authUserId) {



    
    return { user:
        {
          userId: 1,
          name: 'Hayden Smith',
          email: 'hayden.smith@unsw.edu.au',
          numSuccessfulLogins: 3,
          numFailedPasswordsSinceLastLogin: 1,
        }
    }
}