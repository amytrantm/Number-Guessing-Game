function generateWinningNumber() {
  return Math.ceil(Math.random()*100)
}

function shuffle(array){
  for (let i = 0; i < array.length; i++){
    let randomIndex = Math.ceil(Math.random() * i)
    let temp = array[i]
    array[i] = array[randomIndex]
    array[randomIndex] = temp
   }
  return array
}

class Game {
  constructor(){
    this.setToDefault();
  }

  setToDefault() {
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
    this.guessesAllowed = 5;
    this.hintCount = 2;
  }
  
  isGuessRemaining() {
    return this.pastGuesses.length < this.guessesAllowed
  }

  isActive() {
    return !this.isLastGuessCorrect() && this.isGuessRemaining()
  }

  isLastGuessCorrect() {
    return this.playersGuess === this.winningNumber
  }

  remainingGuessCount() {
    return this.guessesAllowed - this.pastGuesses.length
  }

  difference() {
    return Math.abs(this.playersGuess - this.winningNumber)
  }


  isValidGuess(guessString) {
    const guessNumber = +guessString
    return !isNaN(guessNumber) && guessNumber >= 1 && guessNumber <= 100
  }

  getInvalidFeedback(guessString) {
    return `${guessString} is not a valid guess. 
      <br /> Please enter a NUMBER between 1 and 100.`
  }

  checkGuess(playersGuessString) {
    this.playersGuess = +playersGuessString

    if (this.pastGuesses.includes(this.playersGuess)) {
      return `You have already guessed that number.You have ${this.remainingGuessCount()} remaining guess(es)`;
    }

    if (this.isLastGuessCorrect()) {
      this.pastGuesses.push(this.playersGuess);
      return `Congratulation! Winning number is ${this.winningNumber}  🎉 `
    }

    //push new guess number to array pastGuesses
    this.pastGuesses.push(this.playersGuess);

    if (!this.isGuessRemaining()) return `Sorry! Winning number is ${this.winningNumber}`;

    let diff = this.difference();

    if (diff < 10) return `So close! Winning number is between ${Math.max(this.winningNumber - 10, 1)} and ${Math.min(this.winningNumber + 10,100)}. 
    <br /> You have ${this.remainingGuessCount()} remaining guess(es)`;

    if (diff < 25) return `Winning number is between ${Math.max(this.winningNumber - 25, 1)} and ${Math.min(this.winningNumber + 25,100)}. 
    <br /> You have ${this.remainingGuessCount()} remaining guess(es)`;

    if (diff < 50) return `Winning number is between ${Math.max(this.winningNumber - 50, 1)} and ${Math.min(this.winningNumber + 50,100)} 
    <br /> You have ${this.remainingGuessCount()} remaining guess(es)`;

    return `Winning number is between ${Math.max(this.winningNumber - 50, 1)} and ${Math.min(this.winningNumber + 50,100)} 
    <br /> You have ${this.remainingGuessCount()} remaining guess(es)`;
  }

  provideHint() {
    if (this.hintCount > 0){
      this.hintCount--
      const hintArray = [this.winningNumber,  generateWinningNumber(),  generateWinningNumber() ];
      const numbers = shuffle(hintArray)  
      return `Correct number is one of these numbers: ${numbers.join(', ')} `;
    }
    return "You have used Hint 2 times"
  }   
  
}


function newGame(){
  return new Game  
}


//DOM
function clearPlayerInput() {
  document.querySelector('input').value = ''
}

function clearHint() {
  document.getElementById('show-hint').innerHTML=''
}

function clearFeedback() {
  document.getElementById('feedback').innerHTML =''
}

function getThinkingEmoji() {
  const thinkingEmojiElement = document.createElement('img');
  thinkingEmojiElement.src = "https://www.pngkit.com/png/detail/10-105264_thinking-smiley-face-png-picture-royalty-free-stock.png";
  thinkingEmojiElement.className = "emoji";

  return thinkingEmojiElement.cloneNode();
}

function getPlayersNumber() {
  const playersInputNumber = document.querySelector('input').value
  clearPlayerInput();
  clearHint();
  return playersInputNumber;
}

function changeTextColor() {
  document.getElementById('feedback').style.color = 'blue'
}

function playGame() {
  const game = newGame()
  console.log(game)
  // Submit Button
  const submitGuessButton = document.querySelector('#submit-guess')
  submitGuessButton.addEventListener('click', () => {
    if (!game.isActive()) { return; }

    const playersNumber = getPlayersNumber();

    let feedbackText;
    if (game.isValidGuess(playersNumber)) {
      feedbackText = game.checkGuess(playersNumber);
      document.querySelector(`#guess-list li:nth-child(${game.pastGuesses.length})`).innerHTML = game.playersGuess
    } else {
      feedbackText = game.getInvalidFeedback(playersNumber);
    }

    document.getElementById('feedback').innerHTML = feedbackText

    if (game.isLastGuessCorrect()){
      return changeTextColor()
    }

  })

  // Hint Button
  const hintButton = document.getElementById('hint')
  hintButton.addEventListener('click', function() {
    const hintString = game.provideHint(); // not this.provideHint() : this : window
    document.getElementById('show-hint').innerHTML = hintString;
  });

  // Play Button
  const playAgainButton = document.querySelector('#play-btn')
  playAgainButton.addEventListener('click', function(){
    const guesses = document.querySelectorAll('.guess')
    guesses.forEach(guess => {
      guess.innerHTML = ""
      guess.append(getThinkingEmoji())
    })

    clearFeedback();
    clearHint();

    game.setToDefault();
  })
}

playGame()

















