import {
    TokenReturn,
    validDetails,
    ErrorObject
  } from '../types';
  
  import {
    requestClear,
    requestAuthRegister,
    requestAdminUpdateUserPassword,
    requestAuthLogin,
    requestUserDetails,
    requestLogout
  } from './wrapper';
  
  const ERROR = expect.any(String);

  let token: TokenReturn; 
  let errorResult: ErrorObject;

  describe("Tests for adminUpdateUserPassword", () => {
    beforeEach(() => {
      requestClear();
      token = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
    });
    const newPassword = "newPassword1";
    const newerPassword = "newPassword2";
    describe("Success Case", () => {   
      test("Success Case", () => {
        console.log(requestAdminUpdateUserPassword(token.token, validDetails.PASSWORD, newPassword));
        console.log(requestAuthLogin(validDetails.EMAIL, newPassword));
      })  
    })
    describe ("Error Cases", () => {
      token = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
      test.each([
        [token.token, "samplePassword1", newPassword],
        [token.token, validDetails.PASSWORD, validDetails.PASSWORD],
        [token.token, validDetails.PASSWORD, "abcdef1"],
        [token.token, validDetails.PASSWORD, "abcdefgh"],
        [token.token, validDetails.PASSWORD, "12345678"],
      ])('%s', (token, oldPassword, newPassword) => {
        errorResult = requestAdminUpdateUserPassword(token, oldPassword, newPassword);
        expect(errorResult.error).toEqual(ERROR);
        expect(errorResult.statusCode).toEqual(400);
      });
    });
  })
