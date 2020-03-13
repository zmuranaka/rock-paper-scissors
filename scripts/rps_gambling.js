"use strict";

/*
File: rps_gambling.js
Zachary Muranaka
Handles all interactive parts of the rps_gambling game
*/

var buttons = document.querySelectorAll("input[type=button]"); // Creates an array of button objects
var playerChoice; // Variable for the player's choice
var computerChoice; // Variable for the computer's choice
var roundResult; // Variable for the result of the round
var playerScore = 0; // Score for the player
var computerScore = 0; // Score for the computer
var credits = 1000; // This variable tracks the amount of credits the player has. They start with 1000.
var scoreHTML = "Your Score: " + playerScore + "<br>" + "Computer Score: " + computerScore + "<br>" + "Your Credits: " + credits; // Contains HTML for displaying both the player and the computer's score
var timeOut; // This variable allows the timeout in the eraseResult() function to be started or stopped
var playAgainButton; // This variable will contain the "Play Again?" button created when the game is over
var currentBet = 0; // This variable stores the value of your current bet
var previousBet = 0; // This variable stores the value of your previous bet
var roundCount = 0; // This variable stores the count of the round
var rockCount = 0; // This variable tracks the number of rocks that the computer has chosen
var paperCount = 0; // This variable tracks the number of papers that the computer has chosen
var scissorsCount = 0; // This variable tracks the number of scissors that the computer has chosen
var lastRoundTie = false; // This variable stores a boolean value of whether the last round was a tie or not
 
// Alerts the player of the rules and sets up the initial "results" innerHTML
window.onload =
function()
{
    alert("The rules are as follows: you begin with 1000 credits, and can bet your credits to win more! The game lasts nine rounds, and the computer has to choose each option exactly three times." + "\r\n" + "\r\n" + "A win results in you earning credits equal to what you bet, and a loss results in you losing those credits. The catch is, if you tie the computer, on your next bet you have to bet double!" + "\r\n" + "\r\n" + "Bet carefully and amass the largest bank possible!");
    
    document.getElementById("results").innerHTML = scoreHTML + "<br>" + "<em>Enter your bet in the text box below</em>";
    
    // Sets up the high scores if they have not been already
    if(localStorage.getItem("one") == null)
    {
        localStorage.setItem("one", 0);
        localStorage.setItem("two", 0);
        localStorage.setItem("three", 0);
        localStorage.setItem("four", 0);
        localStorage.setItem("five", 0);
    }
    
    resetHighScores();
};

// All of the buttons call the buttonClicked function when clicked
for(let i = 0; i < buttons.length; i++)
    buttons[i].addEventListener("mousedown", buttonClicked);

// Runs when the player chooses rock, paper, or scissors
function buttonClicked(e)
{
    /*
     * The timeOut variable must be cleared when the player clicks any of the buttons.
     * This prevents a previous setTimeout() from interfering with the current round's result.
     * For example, if a player clicked another button before the 1 second setTimeout() had
     * occurred, then the round result would disappear prematurely. This is because
     * the previous setTimeout() had not occurred yet, so it would finish the 1 second
     * and execute the function very soon after the new round's result had displayed,
     * causing the current round's result to disappear almost instantaneously, instead of
     * after 1 second.
     */
    clearTimeout(timeOut);
    playerChoice = e.target.id;
    
    /* 
     * Sets the local variable boxInput to be equal to whatever the user entered in the gambleBox.
     * The || 0 means that if the parseInt() does not return a valid number, then the
     * boxInput is automatically set to 0. For example, if the user put a string of letters
     * into the gambleBox, then instead of evaluating it as NaN it would just set it to 0.
     */
    var boxInput = parseInt(document.getElementById("gambleBox").value) || 0;
    
    // If the player tries to bet a negative amount of credits, their bet is set to 0
    if(boxInput < 0)
        currentBet = 0;
    // The most a player can bet is the amount of credits they have
    else if(boxInput > credits)
        currentBet = credits;
    else
        currentBet = boxInput;
    
    // You have to double your bet if the last round was a tie and you have sufficient credits to do so
    if(lastRoundTie && boxInput < (previousBet * 2) && (previousBet * 2) < credits)
    {
        currentBet = (previousBet * 2);
        alert("You have to double your bet since last round was a tie!" + "\r\n" + "Your bet has been set to: " + currentBet);
    }
    else
        document.getElementById("results").innerHTML = "<br>" + "<br>" + scoreHTML;
    
    document.getElementById("player").src = "images/" + playerChoice + ".jpg";
    computerChoice = randomChoice();
    document.getElementById("computer").src= "images/" + computerChoice + ".jpg";
    roundResult = checkWhoWon(playerChoice, computerChoice);
    roundEnd(roundResult);
}

// Returns a random choice of rock, paper, or scissors, making sure that no choice is picked more than three times
function randomChoice()
{
    switch(Math.floor(Math.random() * 3))
    {
        case 0:
            rockCount++;
            if(rockCount < 4)
                return "rock";
            else
                return randomChoice();
        case 1:
            paperCount++;
            if(paperCount < 4)
                return "paper";
            else
                return randomChoice();
        case 2: 
            scissorsCount++;
            if(scissorsCount < 4)
                return "scissors";
            else
                return randomChoice();
    }
}

// Checks to see who won or if it was a tie
function checkWhoWon(playerChoice, computerChoice)
{
    // The round was a tie if the player and the computer chose the same thing
    if(playerChoice == computerChoice)
        return "tie";
    
    // The next six "else if" statements handle if the player won or lost
    else if(playerChoice == "rock" && computerChoice == "paper")
        return "computer";
    else if(playerChoice == "rock" && computerChoice == "scissors")
        return "player";
    else if(playerChoice == "paper" && computerChoice == "rock")
        return "player";
    else if(playerChoice == "paper" && computerChoice == "scissors")
        return "computer";
    else if(playerChoice == "scissors" && computerChoice == "rock")
        return "computer";
    else if(playerChoice == "scissors" && computerChoice == "paper")
        return "player";
}

// This function updates the score, displays the winner of the round and the updated score, and checks if someone won the game
function roundEnd(roundResult)
{
    if(roundResult == "player")
    {
        lastRoundTie = false;
        credits = parseInt(credits) + parseInt(currentBet); // ParseInt() is needed to make sure they aren't read as strings and concatenated
        playerScore++;
        scoreHTML = "Your Score: " + playerScore + "<br>" + "Computer Score: " + computerScore + "<br>" + "Your Credits: " + credits;
        document.getElementById("results").innerHTML = "<br>" + "You win!" + "<br>" + scoreHTML;
        eraseResult();
        roundCount++;
        if(roundCount == 9)
            endGame("nineRounds");
    }
    else if(roundResult == "computer")
    {
        lastRoundTie = false;
        credits = parseInt(credits) - parseInt(currentBet);
        computerScore++;
        scoreHTML = "Your Score: " + playerScore + "<br>" + "Computer Score: " + computerScore + "<br>" + "Your Credits: " + credits;
        document.getElementById("results").innerHTML = "<br>" + "You lose." + "<br>" + scoreHTML;
        eraseResult();
        roundCount++;
        if(roundCount == 9)
            endGame("nineRounds");
        // The game also ends if you run out of credits
        else if(credits == 0)
            endGame("outOfCredits");
    }
    else
    {
        previousBet = currentBet;
        lastRoundTie = true;
        document.getElementById("results").innerHTML = "<br>" + "Tie" + "<br>" + scoreHTML;
        eraseResult();
        roundCount++;
        if(roundCount == 9)
            endGame("nineRounds");
    }
}

// The result of the round disappears in 1 second
function eraseResult()
{
    timeOut = setTimeout(
    function()
    {
        document.getElementById("results").innerHTML = "<br><br>" + scoreHTML;
    }, 1000);
}

// This function handles when the game ends
function endGame(howGameEnded)
{
    clearTimeout(timeOut);
    
    // Disappears all of the buttons
    for(let i = 0; i < buttons.length; i++)
        buttons[i].style.display = "none";
    
    document.getElementById("creditDiv").style.display = "none";
    
    // Tells the user if the game ended because they ran out of credits
    if(howGameEnded == "outOfCredits")
        alert("You lost all your credits! Better luck next time!");
    
    checkHighScore();
        
    document.getElementById("results").innerHTML = "Game Over<br>" + scoreHTML;
    
    // Creates a Play Again button
    playAgainButton = document.createElement("input");
    playAgainButton.type = "button";
    playAgainButton.value = "Play Again?";
    playAgainButton.id = "playAgain";
    // The site is reloaded if the player clicks the playAgainButton
    playAgainButton.onclick =
    function()
    {
        location.reload();
    };
    document.getElementById("playAgainDiv").appendChild(playAgainButton);
}

// Checks if the player got a high score. If they did it tells them and updates the high scores
function checkHighScore()
{
    if(credits > parseInt(localStorage.getItem("one")))
    {
        alert("You got the Number 1 High Score!");
        localStorage.setItem("five", localStorage.getItem("four"));
        localStorage.setItem("four", localStorage.getItem("three"));
        localStorage.setItem("three", localStorage.getItem("two"));
        localStorage.setItem("two", localStorage.getItem("one"));
        localStorage.setItem("one", credits);
        resetHighScores();
    }
    else if(credits > parseInt(localStorage.getItem("two")))
    {
        alert("You got the Number 2 High Score!");
        localStorage.setItem("five", localStorage.getItem("four"));
        localStorage.setItem("four", localStorage.getItem("three"));
        localStorage.setItem("three", localStorage.getItem("two"));
        localStorage.setItem("two", credits);
        resetHighScores();
    }
    else if(credits > parseInt(localStorage.getItem("three")))
    {
        alert("You got the Number 3 High Score!");
        localStorage.setItem("five", localStorage.getItem("four"));
        localStorage.setItem("four", localStorage.getItem("three"));
        localStorage.setItem("three", credits);
        resetHighScores();
    }
    else if(credits > parseInt(localStorage.getItem("four")))
    {
        alert("You got the Number 4 High Score!");
        localStorage.setItem("five", localStorage.getItem("four"));
        localStorage.setItem("four", credits);
        resetHighScores();
    }
    else if(credits > parseInt(localStorage.getItem("five")))
    {
        alert("You got the Number 5 High Score!");
        localStorage.setItem("five", credits);
        resetHighScores();
    }
}

// This function rewrites the innerHTML of the high score list items
function resetHighScores()
{
    document.getElementById("highScore1").innerHTML = localStorage.getItem("one");
    document.getElementById("highScore2").innerHTML = localStorage.getItem("two");
    document.getElementById("highScore3").innerHTML = localStorage.getItem("three");
    document.getElementById("highScore4").innerHTML = localStorage.getItem("four");
    document.getElementById("highScore5").innerHTML = localStorage.getItem("five");
}
