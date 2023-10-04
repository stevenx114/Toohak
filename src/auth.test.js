import { 
    adminAuthRegister 
} from './auth';

import {
    adminQuizNameUpdate, 
    adminQuizCreate,
} from './quiz';

import { 
    clear,
} from './other';

beforeEach(() => {
    clear();
});

// Success and fail tests for adminAuthRegister
describe('Tests for adminAuthRegister', () => {
    test('Existing email', () => {
        adminAuthRegister('hello@gmail.com', 'password1', 'hello', 'world');
        expect(adminAuthRegister('hello@gmail.com', 'password1', 'hello', 'world')).toEqual({ error: expect.any(String) });
    });
    test('Invalid email', () => {
        expect(adminAuthRegister('hello', 'password1', 'hello', 'world')).toEqual({ error: expect.any(String) }); 
    });
    test('First name has forbidden characters', () => {
        expect(adminAuthRegister('hello@gmail.com', 'password1', 'hello!', 'world')).toEqual({ error: expect.any(String) }); 
    });
    test('First name too short', () => {
        expect(adminAuthRegister('hello@gmail.com', 'password1', 'h', 'world')).toEqual({ error: expect.any(String) }); 
    });
    test('First name too long', () => {
        expect(adminAuthRegister('hello@gmail.com', 'password1', 'hellohellohellohellohello', 'world')).toEqual({ error: expect.any(String) }); 
    });
    test('Last name has forbidden characters', () => {
        expect(adminAuthRegister('hello@gmail.com', 'password1', 'hello', 'world!')).toEqual({ error: expect.any(String) }); 
    });
    test('Last name too short', () => {
        expect(adminAuthRegister('hello@gmail.com', 'password1', 'hello', 'w')).toEqual({ error: expect.any(String) }); 
    });
    test('Last name too long', () => {
        expect(adminAuthRegister('hello@gmail.com', 'password1', 'hello', 'worldworldworldworldworld')).toEqual({ error: expect.any(String) }); 
    });
    test('Password less than 8 characters', () => {
        expect(adminAuthRegister('hello@gmail.com', 'pass', 'hello', 'world')).toEqual({ error: expect.any(String) }); 
    });
    test('Password does not contain at least one number and at least one letter', () => {
        expect(adminAuthRegister('hello@gmail.com', 'password', 'hello', 'world')).toEqual({ error: expect.any(String) });
    });
    test('Valid email, password, first name and last name', () => {
        expect(adminAuthRegister('hello@gmail.com', 'password1', 'hello', 'world')).toEqual({ authUserId: expect.any(Number) });
    });
});