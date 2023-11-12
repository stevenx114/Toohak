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
    getSession,
    PlayerQuestionInfoReturn
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

export const playerQuestionInfo = (playerId: number, questionPosition: number): PlayerQuestionInfoReturn | ErrorObject => {
    const hasPlayerId = false;
    for (const session of sessions) {
        for (const player of players) {
            if (player.playerId === playerId) {
                hasPlayerId = true;
                const currentSession = session;
                break;
            }
            
        }
    }

    if (hasPlayerId === false) {
        throw HTTPError(400, "Player ID does not exist");
    } else if (currentSession.status === 'LOBBY' || currentSession.status === 'END') {
        throw HTTPError(400, "Invalid session state");
    } else if (currentSession.currentQuestion !== questionPosition) {
        throw HTTPError(400, "Incorrect question");
    }

    const quiz = getQuiz(currentSession.quizId);
    if (quiz.numQuestions < questionPosition) {
        throw HTTPError(400, "Invalid question position");
    }
    const question = quiz.questions[questionPosition - 1];
    const findAnswers = quiz.question.answers;
    const newAnswerObj = findAsnwers.map(element => ({
        answerId: element.answerId,
        answer: element.answer,
        colour: element.colour,
    }));
    
    const playerQuestion: PlayerQuestionInfoReturn = {
        questionId: question.questionId,
        question: question.question,
        duration: question.duration,
        thumbnailURL: question.thumbnailURL,
        points: question.points,
        answers: newAnswerObj,
    }

    return playerQuestion;
}