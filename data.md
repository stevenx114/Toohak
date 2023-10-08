```javascript
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
```

[Optional] short description: 
Our data structure consists of an object with two keys where each value is an array of objects. 
