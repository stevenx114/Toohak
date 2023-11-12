import {
    getData,
    setData,
    Quiz,
    Token,
    Answer,
    sessions,
  } from './dataStore';
  
  import validator from 'validator';
  
  import HTTPError from 'http-errors';
  
  import {
    generateCustomUuid
  } from 'custom-uuid';
  
  import {
    getUser,
    getToken,
    getQuiz,
    getQuestion,
    ErrorObject,
    QuizIdReturn,
    QuizListReturn,
    EmptyObject,
    trashedQuizReturn,
    getUserByEmail,
    QuestionBody,
    QuestionIdReturn,
    QuestionDuplicateReturn,
    PlayerIdReturn,
    getSession
  } from './types';
  

export const playerJoin = (sessionId: number, name: string): PlayerIdReturn | ErrorObject => {
    const session = getSession(sessionId);
    if (session.state !== 'LOBBY') {
        throw HTTPError(400, "Invalid session state");
    }

    const findDupName = session.players.find(n => n.name === name);
    if (findDupName) {
        throw HTTPError(400, "Name is not unique");
    }

    let newName = '';
    if (name === '') {
        const letters = 'abcdefghijklmnopqrstuvwxyz';
        const digits = '0123456789';

        // Randomised letters
        for (let i = 0; i < 5; i++) {
            newName += letters.charAt(Math.ceil(Math.random() * letters.length - 1));
        }

        // Randomised numbers
        for (let i = 0; i < 3; i++) {
            newName += digits.charAt(Math.ceil(Math.random() * digits.length - 1));
        }
    } else {
        newName = name;
    }

    const newPlayer = {
        playerId: parseInt(generateCustomUuid('0123456789', 12)),
        score: 0,
        name: newName,
        sessionId: sessionId,
    };

    session.players.push(newPlayer);

    return { playerId: newPlayer.playerId };
}