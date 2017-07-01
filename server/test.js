'use strict';
require('dotenv').config({ silet: true });

var readline = require('readline');
var Writable = require('stream').Writable;
var say = require('say');

const co = require('co');

let DEBUG = true;

const cards = [
  27, 90, 29, 43, 25, 6, 97, 83, 67, 54, 23, 52, 93, 66, 36, 68, 31, 42, 45, 51, 35, 65, 28, 92, 11, 15, 76,
  17, 55, 78, 60, 10, 30, 34, 75, 2, 80, 39, 22, 62, 77, 4, 58, 7, 1, 84, 56, 72, 5, 85, 69, 16, 9, 88, 59,
  41, 61, 91, 82, 26, 12, 96, 24, 63, 74, 57, 8, 32, 71, 47, 81, 53, 64, 40, 21, 13, 89, 38, 79, 87, 94, 50,
  46, 73, 86, 44, 48, 95, 19, 33, 99, 18, 49, 3, 98, 20, 14, 37, 70
];
const doubleCards = [11, 22, 33, 44, 55, 66, 77, 88, 99];
const text = ['H', 'i', ' ', 'r', 'o', 'b', 'o', 't', '!'];
const keys = {
  'a': 4, 'á': 6, 'b': 8, 'c': 7, 'd': 4, 'e': 1, 'é': 6, 'f': 4, 'g': 5, 'h': 5, 'i': 2, 'í': 7,
  'j': 5, 'k': 5, 'l': 6, 'm': 8, 'n': 8, 'o': 3, 'ó': 0, 'ö': 0, 'ő': 3, 'p': 3, 'q': 1, 'r': 1,
  's': 4, 't': 2, 'u': 2, 'ú': 3, 'ü': 0, 'ű': 6, 'v': 8, 'w': 1, 'x': 7, 'y': 7, 'z': 2, ',': 9,
  '.': 9, '-': 9
};

let textIndex = 0;
let indexOfLastCard = 0;
let newCards = [];
let dices = [];
let selectedCards = [];
let finalSum = 0;
let headsSum = 0;

const mutableStdout = new Writable({
  write: function(chunk, encoding, callback) {
    if (!this.muted) {
      process.stdout.write(chunk, encoding);
    } else {
      if (textIndex <= 8) {
        process.stdout.write(text[textIndex++]);
      } else {
        process.stdout.write(' ');
      }
    }
    callback();
  }
});

const restockCards = function(card) {
  const firstIndex = cards.indexOf(card) + 1;

  for (let i = 0; i < 99; i++) {
    const newIndex = (firstIndex + i) % 99;
    newCards[i] = cards[newIndex];
  }
};

const insertDices = function(thrownDices) {
  let index = 0;

  thrownDices.forEach(thrownDice => {
    dices[index++] = parseInt(thrownDice, 10);
  });
};

const countSelectedCards = function() {
  let index = 0;
  let diceSum = -1;
  dices.forEach(dice => {
    diceSum += dice;
    selectedCards[index++] = newCards[diceSum];
  });
};

const getHeadCount = function(card) {
  if (card === 55) {
    return 7;
  } else if (doubleCards.indexOf(card) !== -1) {
    return 5;
  } else if (card % 10 === 0) {
    return 3;
  } else if (card % 5 === 0) {
    return 2;
  } else {
    return 1;
  }
};

const countFinalSums = function() {
  selectedCards.forEach(selectedCard => {
    finalSum += selectedCard;
    headsSum += getHeadCount(selectedCard);
  });
};

const translateText = function(text) {
  var newText = '';

  for (let i = 0; i < text.length; i++) {
    newText += keys[text[i]];
  }

  return newText;
};

const turnMutableMutedOn = function() {
  mutableStdout.muted = true;
};

const turnMutableMutedOff = function() {
  mutableStdout.muted = false;
};

const debugInfo = function(input, text) {
  console.log('\n================DEBUG================');
  console.log('Input: ', input);
  console.log('After split: ', text);
  console.log('indexOfLastCard: ', indexOfLastCard);
  console.log('dices: ', dices);
  console.log('selectedCards', selectedCards);
  console.log('headsSum', headsSum);
  console.log('finalSum', finalSum);
  console.log('================DEBUG================');
};

const clearScreen = function() {
  console.log('\x1Bc');
};

const getMessage = function(messages) {
  let message = [];

  for (let i = 0; i < 8; i++) {
    if (messages[i] === undefined) {
      message[i] = ' '.repeat(43);
    } else if (messages[i].length < 43) {
      message[i] = messages[i] + ' '.repeat(43 - messages[i].length);
    }
  }

  return message;
};

const drawPicture = function(messages) {
  let message = getMessage(messages);

  const picture = `             ____________________________________________________
            /                                                    \\
           |    _____________________________________________     |
           |   |                                             |    |
           |   |  ${message[0]}|    |
           |   |  ${message[1]}|    |
           |   |  ${message[2]}|    |
           |   |  ${message[3]}|    |
           |   |  ${message[4]}|    |
           |   |  ${message[5]}|    |
           |   |  ${message[6]}|    |
           |   |  ${message[7]}|    |
           |   |                                             |    |
           |   |                                             |    |
           |   |                                             |    |
           |   |                                             |    |
           |   |_____________________________________________|    |
           |                                                      |
            \\_____________________________________________________/
                   \\_______________________________________/
                _______________________________________________
             _-'    .-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.  --- \`-_
          _-'.-.-. .---.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.--.  .-.-.\`-_
       _-'.-.-.-. .---.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-\`__\`. .-.-.-.\`-_
     -'.-.-.-.-. .-----.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-----. .-.-.-.-.\`-_
  _-'.-.-.-.-.-. .---.-. .-----------------------------. .-.---. .---.-.-.-.\`-_
 :-----------------------------------------------------------------------------:
 \`---._.-----------------------------------------------------------------._.---'`;

  clearScreen();
  console.log(picture);
};

const transformTwoDigital = function(card) {
  if (card < 10) {
    return ` ${card}`;
  }

  return card;
};

const drawFinalPicture = function() {
  let reveal = [
    'Szabó G. Gábor!',
    '',
    'Lásd hát jóslatom!',
    '',
    '',
    '',
    '',
    ''
  ];

  drawPicture(reveal);
  say.speak('Szabó G. Gábor! Lásd hát jóslatom!', 'Mariska');

  for (let i = 1; i < 6; i++) {
    setTimeout(function() {
      reveal[6] += `      ${dices[i - 1]}`;
      reveal[7] += `     ${transformTwoDigital(selectedCards[i - 1])}`;

      drawPicture(reveal);
    }, i * 3000);
  }
};

co(async function() {
  const debugTime = DEBUG ? 10000 : 0;

  const rl = readline.createInterface({
    input: process.stdin,
    output: mutableStdout,
    terminal: true
  });

  turnMutableMutedOff();

  clearScreen();
  drawPicture(['']);

  rl.on('line', (input) => {
    const text = input.replace(/[0-9]/g, '').split(' ');

    text[1] = text[1].substr(0, 5);

    indexOfLastCard = parseInt(translateText(text[0]), 10);

    insertDices(translateText(text[1]).split(''));
    restockCards(indexOfLastCard);
    countSelectedCards();
    countFinalSums();

    debugInfo(input, text);

    setTimeout(function() {
      rl.close();

      drawPicture([
        'Én a nagy Mariska mágus,',
        'varázserőm segítségével,',
        'ím kinyilatkoztatám jóslatom!'
      ]);

      say.speak('Én a nagy Mariska mágus, varázserőm segítségével, ím kinyilatkoztatám jóslatom!', 'Mariska');

      setTimeout(function() {
        drawFinalPicture();
      }, 15000);
    }, debugTime);
  });

  turnMutableMutedOn();

}).then(() => {
}).catch(error => {
  console.log(error);

  process.exit(1);
});
