// YOU SHOULD MODIFY THIS OBJECT BELOW
let data = {
  users: [
    {
      userId: 12345, 
      name: 'John Smith',
      email: 'johnsmith@gmail.com',
      password: 'ilovecat123',
      numSuccessfulLogins: 1,
      numFailedPasswordsSinceLastLogin: 0,
      quizzesOwned: [123],
    }
  ], 
  quizzes: [
    {
    quizId: 123,
    name: 'What pizza are you?',
    timeCreated: 1683125870,
    timeLastEdited: 1683125871,
    description: 'This is my quiz',
    }
  ]
};

// YOU SHOULDNT NEED TO MODIFY THE FUNCTIONS BELOW IN ITERATION 1

/*
Example usage
    let store = getData()
    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Rando'] }

    names = store.names

    names.pop()
    names.push('Jake')

    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Jake'] }
    setData(store)
*/

// Use get() to access the data
function getData() {
  return data;
}

// Use set(newData) to pass in the entire data object, with modifications made
function setData(newData) {
  data = newData;
}

export { getData, setData };
