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
    test('Fails on duplicate email', () => {
        let newUserId = adminAuthRegister('hello@gmail.com', 'password', 'hello', 'world');
        expect(adminAuthRegister('hello@gmail.com', 'password', 'hello', 'world')).toEqual({ error: expect.any(String) });
    });
    test('Fails on invalid email', () => {
        expect(adminAuthRegister('hello', 'password1', 'hello', 'world')).toEqual({ error: expect.any(String) }); 
    });
    test('Fails on invalid name', () => {
        expect(adminAuthRegister('hello@gmail.com', 'password1', 'hello!', 'world')).toEqual({ error: expect.any(String) }); 
    });
    test('Fails on invalid first name length', () => {
        expect(adminAuthRegister('hello@gmail.com', 'password1', 'h', 'world')).toEqual({ error: expect.any(String) }); 
    });
    test('Fails on invalid first name length', () => {
        expect(adminAuthRegister('hello@gmail.com', 'password1', 'hellohellohellohellohello', 'world')).toEqual({ error: expect.any(String) }); 
    });
    test('Fails on invalid last name', () => {
        expect(adminAuthRegister('hello@gmail.com', 'password1', 'hello', 'world!')).toEqual({ error: expect.any(String) }); 
    });
    test('Fails on invalid last name length', () => {
        expect(adminAuthRegister('hello@gmail.com', 'password1', 'hello', 'w')).toEqual({ error: expect.any(String) }); 
    });
    test('Fails on invalid last name length', () => {
        expect(adminAuthRegister('hello@gmail.com', 'password1', 'hello', 'worldworldworldworldworld')).toEqual({ error: expect.any(String) }); 
    });
    test('Fails if password is less than 8 characters', () => {
        expect(adminAuthRegister('hello@gmail.com', 'pass', 'hello', 'worldworldworldworldworld')).toEqual({ error: expect.any(String) }); 
    });
    test('Fails if password does not contain at least one number and at least one letter', () => {
        expect(adminAuthRegister('hello@gmail.com', 'password', 'hello', 'worldworldworldworldworld')).toEqual({ error: expect.any(String) });
    });
    test('Valid email, password, first name and last name', () => {
        expect(adminAuthRegister('hello@gmail.com', 'password1', 'hello', 'world')).toEqual({ authUserId: expect.any(Number) });
    });
});