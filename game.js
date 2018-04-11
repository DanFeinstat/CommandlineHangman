var Inquirer = require("inquirer");
var Word = require("./word");
var Letter = require("./letter");
var request = require("request");

var letterGuessedArray = [];
var previouslyGuessed = [];
var numberGuesses = 15;

function playGame() {
  request(
    "http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=true&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5",
    function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var responseJson = JSON.parse(body);
        var randomWord = responseJson.word;

        for (var i = 0; i < randomWord.length; i++) {
          letterGuessedArray.push(new Letter(randomWord.charAt(i)));
        }

        var currentWord = new Word(letterGuessedArray);

        var queryUser = function() {
          if (numberGuesses > 0) {
            var wordDisplay = currentWord.show();

            console.log("You have " + numberGuesses + " guesses remaining.");
            Inquirer.prompt([
              {
                name: "letter",
                message: "Please guess a letter.",
              },
            ]).then(function(userInput) {
              var guessedLetter = userInput.letter.toLowerCase();

              var alreadyGuessed = false;
              for (var i = 0; i < previouslyGuessed.length; i++) {
                if (guessedLetter === previouslyGuessed[i]) {
                  alreadyGuessed = true;
                  break;
                }
              }

              if (alreadyGuessed) {
                console.log("This letter was already guessed.");
              } else {
                numberGuesses--;
                previouslyGuessed.push(guessedLetter);
                currentWord.trueCharacter(guessedLetter);
              }

              if (currentWord.finishedWord()) {
                console.log("Congrats, you've guessed the word correctly!");
                return;
              }

              queryUser();
            });
          } else {
            console.log("You've used all of your guesses.");
          }
        };

        queryUser();
      }
    }
  );
}

playGame();
