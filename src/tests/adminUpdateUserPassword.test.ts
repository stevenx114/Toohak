import {
    TokenReturn,
    validDetails,
    ErrorObject
  } from '../types';
  
  import {
    requestClear,
    requestAuthRegister,
    requestUserDetails,
    requestAdminUpdateUserPassword,
  } from './wrapper';
  
  const ERROR = expect.any(String);

  beforeEach(() => {
    requestClear();
    let token; 
  });

  describe("Tests for adminUpdateUserPassword", () => {
    let errorResult: ErrorObject;
    const newPassword = "newPassword1";
    const newerPassword = "newPassword2";
    describe("Success Case", () => {    
      token = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
      requestAdminUpdateUserPassword(token, validDetails.PASSWORD, newPassword);
      expect(requestUserDetails(token).user.password).toEqual(newPassword);
      requestAdminUpdateUserPassword(token, newPassword, newerPassword);
      expect(requestUserDetails(token).user.password).toEqual(newerPassword);
      expect(requestUserDetails(token).user.previousPasswords).toEqual([validDetails.PASSWORD, newPassword]);
      expect(requestAdminUpdateUserPassword(token, newerPassword, newPassword).error).toEqual(expect.any(string));
      expect(requestAdminUpdateUserPassword(token, newerPassword, newPassword).statusCode).toEqual(400);
    })
    describe ("Error Cases", () => {
      requestClear()
      token = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
      test.each([
        [token, "samplePassword1", newPassword],
        [token, validDetails.PASSWORD, validDetails.PASSWORD],
        [token, validDetails.PASSWORD, "abcdef1"],
        [token, validDetails.PASSWORD, "abcdefgh"],
        [token, validDetails.PASSWORD, "12345678"],
      ])('%s', (token, oldPassword, newPassword) => {
        errorResult = requestAdminUpdateUserPassword(token, oldPassword, newPassword);
        expect(errorResult.error).toEqual(ERROR);
        expect(errorResult.statusCode).toEqual(400);
      });
    });
  })
