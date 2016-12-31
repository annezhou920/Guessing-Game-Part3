function generateWinningNumber(){
  return Math.floor((Math.random() * 100) + 1);
}

function shuffle(arr) {
 for(var i = arr.length-1; i > 0; i--) {
   var randomIndex = Math.floor(Math.random() * (i + 1));
   var temp = arr[i];
   arr[i] = arr[randomIndex];
   arr[randomIndex] = temp;
 }
 return arr;
}

//Fisher-Yates - https://bost.ocks.org/mike/shuffle/
// function shuffle(arr){
//   var length = arr.length, current, i;
//   // WHILE THERE REMAIN ELEMENTS TO SHUFFLE
//   while(length){
//     // PICK A REMAINING ELEMENT...
//     i = Math.floor(Math.random() * length--);
//     // SWAP IT WITH CURRENT ELEMENT IN PLACE
//     current = arr[length];
//     arr[length] = arr[i];
//     arr[i] = current;
//   }
//   return arr;
// }

function Game(){
  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function(){
  return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function(){
  if (this.playersGuess < this.winningNumber){
    return true;
  } else {
    return false;
  }
}

Game.prototype.playersGuessSubmission = function(num){
  if (num < 1 || num > 100 || isNaN(num)){
    throw "That is an invalid guess."
  }
  this.playersGuess = num;
  return this.checkGuess();
}


Game.prototype.checkGuess = function(){
  if (this.playersGuess === this.winningNumber){
    // .prop() method enables/disables element with true/false
    $("#hint", "#submit").prop("disabled", true);
    $('#subtitle').text("Click the reset button to play again!");
    return "You Win!";
  } else if (this.pastGuesses.indexOf(this.playersGuess) > -1){
      $('#subtitle').text("Guess again!");
      return "You have already guessed that number.";
  } else {
    this.pastGuesses.push(this.playersGuess);
    $('#guess-list li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);
    if (this.pastGuesses.length === 5){
      $("#hint", "#submit").prop("disabled", true);
      $('#subtitle').text("Click the reset button to play again!");
      return "You Lose.";
    } else {
      if (this.isLower()){
        $('#subtitle').text("Guess Higher!")
      } else {
        $('#subtitle').text("Guess Lower!")
      }
      if (this.difference() < 10){ return "You\'re burning up!" }
      else if (this.difference() < 25){ return "You\'re lukewarm." }
      else if (this.difference() < 50){ return "You\'re a bit chilly." }
      else { return "You\'re ice cold!" }
    }
  }
}

function newGame(){
  return new Game();
}

Game.prototype.provideHint = function(){
  var hintArr = [this.winningNumber, generateWinningNumber(), generateWinningNumber()];
  return shuffle(hintArr);
}

// jQUERY SECTION

function makeAGuess(game){
  var input = +$('#player-input').val();
  // CLEAR INPUT ELEMENT WITH EMPTY STRING
  $('#player-input').val("");
  var output = game.playersGuessSubmission(input);
  // OUTPUT RETURNS STRING OF NEW TITLE TEXT
  $('#title').text(output);
}

$(document).ready(function(){
  var game = new Game();

  $('#submit').click(function(e){
    makeAGuess(game);
  })

  $('#player-input').keypress(function(event){
    // KEY VALUE OF ENTER
    if (event.which === 13){
      makeAGuess(game);
    }
  })

  $('#reset').click(function(){
    game = newGame();
    $('#title').text("Play the Guessing Game!");
    $('#subtitle').text("Guess a number between 1-100!");
    $('#guess-list li').text("-");
    $("#hint", "#submit").prop("disabled", false);
  })

  $('#hint').click(function(){
    $('#title').text("Pick your winning number: " + game.provideHint());
  })

});
