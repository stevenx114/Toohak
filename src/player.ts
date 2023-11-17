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
  PlayerQuestionInfoReturn,
  sessionState,
  PlayerStatusReturn,
  PlayerChatSendReturn,
  QuestionResult,
  PlayerChatReturn
} from './types';

import {
  getSession,
  getQuiz,
  getPlayer
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
  data.players.push(newPlayer);
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

  if (currentSession.state === sessionState.LOBBY || currentSession.state === sessionState.END) {
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

/**
 * Get the status of a guest player that has already joined a session
 *
 * @param {number} playerId
 * @returns {object} PlayerStatusReturn | ErrorObject
 */
export const playerStatus = (playerId: number): PlayerStatusReturn | ErrorObject => {
  const data = getData();
  let foundPlayer;
  let foundSession;

  data.sessions.forEach(session => {
    const player = session.players.find(p => p.playerId === playerId);
    if (player) {
      foundPlayer = player;
      foundSession = session;
    }
  });

  if (!foundPlayer) {
    throw HTTPError(400, 'Player ID does not exist');
  }

  return {
    state: foundSession.state,
    numQuestions: foundSession.quiz.numQuestions,
    atQuestion: foundSession.atQuestion
  };
};

/**
 *
 * @param playerId: number
 * @param messageBody: string
 * @returns MessageReturn
 */
export const playerChatSend = (playerId: number, messageBody: string): PlayerChatSendReturn | ErrorObject => {
  const data = getData();
  const curPlayer = getPlayer(playerId);
  if (!curPlayer) {
    throw HTTPError(400, 'Player ID does not exist');
  }
  if (messageBody.length < 1 || messageBody.length > 100) {
    throw HTTPError(400, 'Message body is less than 1 character or more than 100 characters');
  }
  const messageObject = {
    playerId: playerId,
    playerName: curPlayer.name,
    timeSent: Math.floor((new Date()).getTime() / 1000),
    messageBody: messageBody
  };
  const curSession = getSession(curPlayer.sessionId);
  curSession.chat.push(messageObject);
  setData(data);
  return {
    message: {
      messageBody: messageBody
    }
  };
};

/**
 *
 * @param playerId: number
 * @param questionPosition: number
 * @returns QuestionResult
 */
export const playerQuestionResults = (playerId: number, questionPosition: number): QuestionResult | ErrorObject => {
  const curPlayer = getPlayer(playerId);
  if (!curPlayer) {
    throw HTTPError(400, 'PlayerId does not exist');
  }
  const sessionId = curPlayer.sessionId;
  const curSession = getSession(sessionId);
  if (curSession.state !== sessionState.ANSWER_SHOW) {
    throw HTTPError(400, 'Session is not in ANSWER_SHOW state');
  }
  const curQuiz = curSession.quiz;
  if (questionPosition > curQuiz.numQuestions || questionPosition < 1) {
    throw HTTPError(400, 'Question position is not valid for the session this player is in');
  }
  if (questionPosition > curSession.atQuestion) {
    throw HTTPError(400, 'Session is not yet up to this question');
  }
  const curQuestion = curQuiz.questions[curSession.atQuestion - 1];
  const correctPlayers = curSession.players.filter(p => p.questionsCorrect[curSession.atQuestion - 1]);
  const correctPlayerNames = correctPlayers.map(p => p.name);
  const timeTaken = curSession.players.map(p => p.answerTime[curSession.atQuestion - 1]);
  const totalTime = timeTaken.reduce((a, b) => a + b);
  const averageTime = Math.floor(totalTime / curSession.players.length);
  const percentCorrect = Math.round((correctPlayers.length / curSession.players.length) * 100);
  return {
    questionId: curQuestion.questionId,
    playersCorrectList: correctPlayerNames,
    averageAnswerTime: averageTime,
    percentCorrect: percentCorrect
  };
};

/*
 * Return all messages that are in the same session as the player
 *
 * @param {number} playerId
 * @returns {object} PlayerChatReturn | ErrorObject
 */
export const playerChatView = (playerId: number): PlayerChatReturn | ErrorObject => {
  const curPlayer = getPlayer(playerId);
  if (!curPlayer) {
    throw HTTPError(400, 'Player ID does not exist');
  }

  const curSession = getSession(curPlayer.sessionId);
  return {
    messages: curSession.chat
  };
};
