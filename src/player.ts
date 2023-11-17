import {
  getData,
  setData,
} from './dataStore';

import HTTPError from 'http-errors';

import {
  generateCustomUuid
} from 'custom-uuid';

import {
  ErrorObject,
  PlayerIdReturn,
  PlayerQuestionInfoReturn
} from './types';

import {
  getSession,
  getQuiz
} from './helper';

/**
 *
 * @param sessionId
 * @param name
 * @returns
 */
export const playerJoin = (sessionId: number, name: string): PlayerIdReturn | ErrorObject => {
  const data = getData();
  const session = getSession(sessionId);
  if (session.state !== 'LOBBY') {
    throw HTTPError(400, 'Invalid session state');
  }

  const findDupName = session.players.find(n => n.name === name);
  if (findDupName) {
    throw HTTPError(400, 'Name is not unique');
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
  setData(data);

  return { playerId: newPlayer.playerId };
};

/**
 *
 * @param playerId
 * @param questionPosition
 * @returns
 */
export const playerQuestionInfo = (playerId: number, questionPosition: number): PlayerQuestionInfoReturn | ErrorObject => {
  const data = getData();
  let currentSession;
  let hasPlayerId = false;
  for (const session of data.sessions) {
    for (const player of session.players) {
      if (player.playerId === playerId) {
        hasPlayerId = true;
        currentSession = session;
        break;
      }
    }
  }

  if (hasPlayerId === false) {
    throw HTTPError(400, 'Player ID does not exist');
  }

  const quiz = getQuiz(currentSession.quizId);
  if (quiz.numQuestions < questionPosition || questionPosition < 0) {
    throw HTTPError(400, 'Invalid question position');
  }

  if (currentSession.state === 'LOBBY' || currentSession.state === 'END') {
    throw HTTPError(400, 'Invalid session state');
  } else if (currentSession.atQuestion !== questionPosition) {
    throw HTTPError(400, 'Incorrect question');
  }

  const question = quiz.questions[questionPosition - 1];
  const findAnswers = question.answers;
  const newAnswerObj = findAnswers.map(element => ({
    answerId: element.answerId,
    answer: element.answer,
    colour: element.colour,
  }));

  const playerQuestion: PlayerQuestionInfoReturn = {
    questionId: question.questionId,
    question: question.question,
    duration: question.duration,
    thumbnailUrl: question.thumbnailUrl,
    points: question.points,
    answers: newAnswerObj,
  };

  return playerQuestion;
};
