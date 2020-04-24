"use strict";

/*
File: rps_classic.js
Zachary Muranaka
Handles all interactive parts of the rps_classic game
*/

var buttons = document.querySelectorAll("input[type=button]"); // Creates an array of button objects
var playerChoice; // Variable for the player's choice
var computerChoice; // Variable for the computer's choice
var roundResult; // Variable for the result of the round
var playerScore = 0; // Score for the player
var computerScore = 0; // Score for the computer
var scoreHTML = "Your Score: " + playerScore + "<br>" + "Computer Score: " + computerScore; // Contains HTML for displaying both the player and the computer's score
var timeOut; // This variable allows the timeout in the eraseResult() function to be started or stopped
var playAgainButton; // This variable will contain the "Play Again?" button created when the game is over

// Sets up the initial innerHTML of the "results" div
window.onload =
function()
{
    document.getElementById("results").innerHTML = "Welcome! Click one of the buttons to begin the game!" +
    "<br>" + "Will you be the first to three points?" + "<br>" + scoreHTML;
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
    document.getElementById("player").src = "images/" + playerChoice + ".jpg";
    computerChoice = randomChoice();
    document.getElementById("computer").src= "images/" + computerChoice + ".jpg";
    roundResult = checkWinner(playerChoice, computerChoice);
    roundEnd(roundResult); 
}

// Returns a random choice of rock, paper, or scissors
function randomChoice()
{
    switch(Math.floor(Math.random() * 3))
    {
        case 0: return "rock";
        case 1: return "paper";
        case 2: return "scissors";
    }
}

// Checks to see who won or if it was a tie
function checkWinner(playerChoice, computerChoice)
{
    // The round was a tie if the player and the computer chose the same thing
    if(playerChoice == computerChoice) return "tie";
    
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
        playerScore++;
        scoreHTML = "Your Score: " + playerScore + "<br>" + "Computer Score: " + computerScore;
        document.getElementById("results").innerHTML = "<br>" + "You win!" + "<br>" + scoreHTML;
        eraseResult();
        if(playerScore == 3) endGame();
    }
    else if(roundResult == "computer")
    {
        computerScore++;
        scoreHTML = "Your Score: " + playerScore + "<br>" + "Computer Score: " + computerScore;
        document.getElementById("results").innerHTML = "<br>" + "You lose." + "<br>" + scoreHTML;
        eraseResult();
        if(computerScore == 3) endGame();
    }
    else
    {
        document.getElementById("results").innerHTML = "<br>" + "Tie" + "<br>" + scoreHTML;
        eraseResult();
    }
}

// The result of the round disappears in 1 second
function eraseResult()
{
    // The timeOut variable is set equal to the setTimeout
    timeOut = setTimeout(
    function()
    {
        document.getElementById("results").innerHTML = "<br><br>" + scoreHTML;
    }, 1000);
}

// Prevents the player from continuing to play and creates a button that asks if they would like to play again
function endGame()
{
    clearTimeout(timeOut);
    
    // Disables all of the buttons
    for(let i = 0; i < buttons.length; i++)
        buttons[i].style.display = "none";
    
    // Creates a Play Again button
    playAgainButton = document.createElement("input");
    playAgainButton.type = "button";
    playAgainButton.value = "Play Again?";
    playAgainButton.id = "playAgain";
    // The site is reloaded if the player clicks the playAgainButton
    playAgainButton.onclick = function() { location.reload(); };
    document.getElementById("playAgainDiv").appendChild(playAgainButton);
}
