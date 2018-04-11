//letter constructor
var Letter = function(character) {
  this.to_Display = character;
  this.letterChosen = false;
  this.display = function() {
    if (this.letterChosen) {
      return this.to_Display;
    } else {
      return "_";
    }
  };
  this.correctChoice = function(userGuess) {
    if (userGuess == this.to_Display) {
      this.letterChosen = true;
    }
  };
  this.choiceStatus = function() {
    return this.letterChosen;
  };
};

//export the module for use in other files
module.exports = Letter;
