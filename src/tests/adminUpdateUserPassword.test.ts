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
  } from './wrapper';
  
  const ERROR = expect.any(String);

  let token: TokenReturn; 
  let result: ErrorObject;

  beforeEach(() => {
    requestClear();
    token = requestAuthRegister(validDetails.EMAIL, validDetails.PASSWORD, validDetails.FIRST_NAME, validDetails.LAST_NAME);
  });

  describe("Tests for adminUpdateUserPassword", () => {
    const newPassword = "newPassword1";
    const newerPassword = "newPassword2";
    describe("Success Case", () => {   
      test("Updates password correctly", () => {
        expect(requestAdminUpdateUserPassword(token.token, validDetails.PASSWORD, newPassword)).toStrictEqual({});
        requestAuthLogin(validDetails.EMAIL, newPassword);
        expect(requestAuthLogin(validDetails.EMAIL, validDetails.PASSWORD)).toStrictEqual({
          error: ERROR,
          statusCode: 400
        });
        requestAdminUpdateUserPassword(token.token, newPassword, newerPassword);
        requestAuthLogin(validDetails.EMAIL, newerPassword);
        expect(requestAuthLogin(validDetails.EMAIL, newPassword)).toStrictEqual({
          error: ERROR,
          statusCode: 400
        });
      })  
      test("Updates user details correctly", () => {
        expect(requestAdminUpdateUserPassword(token.token, validDetails.PASSWORD, newPassword)).toStrictEqual({});
        requestAuthLogin(validDetails.EMAIL, validDetails.PASSWORD);
        requestAuthLogin(validDetails.EMAIL, validDetails.PASSWORD);
        requestAuthLogin(validDetails.EMAIL, validDetails.PASSWORD);
        expect(requestUserDetails(token.token).user.numFailedPasswordsSinceLastLogin).toEqual(3);
        requestAuthLogin(validDetails.EMAIL, newPassword);
        expect(requestUserDetails(token.token).user.numSuccessfulLogins).toEqual(2);
      })
    })
    describe ("Error Cases", () => {
      test("Old password same as new password", () => {
        result = requestAdminUpdateUserPassword(token.token, validDetails.PASSWORD, validDetails.PASSWORD);
        expect(result.statusCode).toEqual(400);
        expect(result.error).toEqual(ERROR);
      })
      test("Old password is not the same as current password", () => {
        result = requestAdminUpdateUserPassword(token.token, "samplePassword1", validDetails.PASSWORD);
        expect(result.statusCode).toEqual(400);
        expect(result.error).toEqual(ERROR);
      })
      test("New Password has already been used before by this User", () => {
        requestAdminUpdateUserPassword(token.token, validDetails.PASSWORD, newPassword);
        result = requestAdminUpdateUserPassword(token.token, newPassword, validDetails.PASSWORD);
        expect(result.statusCode).toEqual(400);
        expect(result.error).toEqual(ERROR);
      })
      test("New Password is less than 8 characters", () => {
        result = requestAdminUpdateUserPassword(token.token, validDetails.PASSWORD, "abcdef1");
        expect(result.statusCode).toEqual(400);
        expect(result.error).toEqual(ERROR);
      })
      test("New Password does not contain at least one letter", () => {
        result = requestAdminUpdateUserPassword(token.token, validDetails.PASSWORD, "12345678");
        expect(result.statusCode).toEqual(400);
        expect(result.error).toEqual(ERROR);
      })
      test("New Password does not contain at least one number", () => {
        result = requestAdminUpdateUserPassword(token.token, validDetails.PASSWORD, "abcdefgh");
        expect(result.statusCode).toEqual(400);
        expect(result.error).toEqual(ERROR);
      })
    }); 
  })
