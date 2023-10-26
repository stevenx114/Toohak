import { requestClear } from './wrapper'; //requestQuizCreateV1, requestUserDetails, requestQuizList } from './wrapper';
//import { validDetails } from '../types';

const ERROR = { error: expect.any(String) };

describe('/v1/clear tests', () => {
  let token;

  test('Correct Return Value', () => {
    const res = requestClear();
    expect(res.statusCode).toBe(200);
    expect((JSON.parse(res.body as string))).toStrictEqual({});
  });

  test.skip('Removing user data', () => {
    //token = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME).body;
    //const res = requestClear();
    //expect(res.statusCode).toBe(200);
    //expect(res.body).toStrictEqual({});
    //expect(requestUserDetails(token.sessionId)).toStrictEqual(ERROR);
  });

  test.skip('Removing quiz data', () => {
    //token = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    //requestQuizCreate(token.body.sessionId, validDetails.QUIZ_NAME, validDetails.DESCRIPTION);
    //const res = requestClear();
    //expect(res.statusCode).toBe(200);
    //expect(res.body).toStrictEqual({});
    //expect(requestQuizList(token.body.sessionId));
  });
});

