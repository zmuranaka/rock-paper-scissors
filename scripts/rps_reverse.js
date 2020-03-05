"use strict"

/*
File: rps_reverse.js
Zachary Muranaka
Handles all interactive parts of the rps_reverse game
*/

var buttons = document.querySelectorAll("input[type=button]"); // Creates an array of button objects
var playerChoice; // Variable for the player's choice
var computerChoice; // Variable for the computer's choice
var computerPrompt; // Variable that stores what the computer told you to do
var roundResult; // Variable for the result of the round
var playerScore = 0; // Score for the player
var scoreHTML = "Your Score: " + playerScore; // Contains HTML for displaying both the player and the computer's score
var playerImg; // Contains the HTML for the player image
var playAgainButton; // This variable will contain the "Play Again?" button created when the game is over
var secsLeft = 60; // Tracks the number of seconds the player has left
var clockID = setInterval(countdown, 1000); // Runs the countdown() function every second, and stores this timed command in a variable named clockID

// Alerts the player of the rules and begins the game
window.onload =
function()
{
    alert("The rules are as follows: you begin with 60 seconds on the timer, and are trying to rack up the highest score you can! The computer will show you rock, paper, or scissors and tell you if you need to win, tie, or lose." + "\r\n" + "\r\n" + "You need to pick the correct option to fulfill that prompt. If you choose right, you score a point, but the catch is - if you choose wrong, you LOSE two points!" + "\r\n" + "\r\n" + "Pick carefully and try to score the highest before the time runs out!");
    
    // Sets up the high scores if they have not been already
    if(localStorage.getItem("One") == null)
    {
        localStorage.setItem("One", 0);
        localStorage.setItem("Two", 0);
        localStorage.setItem("Three", 0);
        localStorage.setItem("Four", 0);
        localStorage.setItem("Five", 0);
    }
    
    resetHighScores();
    
    document.getElementById("results").innerHTML = scoreHTML;
    
    prompt();
}

// All of the buttons call the buttonClicked function when clicked
for(var i = 0; i < buttons.length; i++)
    buttons[i].addEventListener("mousedown", buttonClicked);

// The computer will randomly pick between rock, paper, or scissors, and tell you what you need to do to score a point
function prompt()
{
    computerChoice = rpsChoice();
    document.getElementById("computer").src= "images/" + computerChoice + ".jpg";
    computerPrompt = wtlChoice();
    document.getElementById("results").innerHTML = computerPrompt + "<br>" + scoreHTML;
}

// Runs when the player chooses rock, paper, or scissors
function buttonClicked(e)
{
    playerChoice = e.target.id;
    // Clears the innerHTML of the div
    document.getElementById("playerDiv").innerHTML = null;
    
    // This variable stores the path to the img of the player's choice
    var pathStr = "images/" + playerChoice + ".jpg";
    playerImg = "<img src=" + pathStr + " id='player'>";
    document.getElementById("playerDiv").innerHTML += playerImg;
    roundResult = checkWinner(playerChoice, computerChoice);
    roundEnd(roundResult); 
}

// Returns a random choice of rock, paper, or scissors
function rpsChoice()
{
    switch(Math.floor(Math.random() * 3))
    {
        case 0: return "rock";
        case 1: return "paper";
        case 2: return "scissors";
    }
}

// Returns a random choice of Win!, Tie, or Lose!
function wtlChoice()
{
    switch(Math.floor(Math.random() * 3))
    {
        case 0: return "Win!";
        case 1: return "Tie";
        case 2: return "Lose!";
    }
}

// Checks to see who won or if it was a tie
function checkWinner(playerChoice, computerChoice)
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

// This function updates the score based on the player's choice and restarts the round
function roundEnd(roundResult)
{
    if(roundResult == "player" && computerPrompt == "Win!" || roundResult == "tie" && computerPrompt == "Tie" || roundResult == "computer" && computerPrompt == "Lose!")
    {
        playerScore++;
        scoreHTML = "Your Score: " + playerScore;
        document.getElementById("playerDiv").innerHTML += "<br>" + "Correct choice!";
        document.getElementById("results").innerHTML = scoreHTML;
        prompt();
    }
    else
    {
        // Wrong choices are double penalized
        playerScore -= 2;
        scoreHTML = "Your Score: " + playerScore;
        document.getElementById("playerDiv").innerHTML += "<br>" + "Wrong choice!";
        document.getElementById("results").innerHTML = scoreHTML;
        prompt();
    }
}

// Prevents the player from continuing to play and creates a button that asks if they would like to play again
function endGame()
{
    // Disables all of the buttons
    for(var i = 0; i < buttons.length; i++)
        buttons[i].style.display = "none";
    
    checkHighScore();
    
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
    }
    document.getElementById("playAgainDiv").appendChild(playAgainButton);
}

// Represents one second occurring
function countdown()
{
    var secsString = addLeadingZero(secsLeft); // Calls the addLeadingZero() function to convert the minsLeft and secsLeft variables to strings
    document.getElementById("timer").textContent = secsString;
    checkTimer(); // Runs the checkTimer() function to test if there is any time left    
    secsLeft--; // Decrements the secsLeft variable
}

// Stops the clock once the time has run out and notifies the user that the time expired
function stopClock()
{
    document.getElementById("timer").insertAdjacentHTML("beforeend", "<br />(Time up!)");
    clearInterval(clockID);
    endGame();
}

// If there are no seconds left, the clock is stopped
function checkTimer()
{
    if (secsLeft === 0)
        stopClock();
}

// The addLeadingZero() function adds a leading zero to values which are less than 10 but greater than 0
function addLeadingZero(num)
{
    var numStr = (num < 10 && num > 0) ? ("0" + num) : "" + num;
    return numStr;
}

// Checks if the player got a high score. If they did it tells them and updates the high scores
function checkHighScore()
{
    if(playerScore > parseInt(localStorage.getItem("One")))
    {
        alert("You got the Number 1 High Score!");
        localStorage.setItem("Five", localStorage.getItem("Four"));
        localStorage.setItem("Four", localStorage.getItem("Three"));
        localStorage.setItem("Three", localStorage.getItem("Two"));
        localStorage.setItem("Two", localStorage.getItem("One"));
        localStorage.setItem("One", playerScore);
        resetHighScores();
    }
    else if(playerScore > parseInt(localStorage.getItem("Two")))
    {
        alert("You got the Number 2 High Score!");
        localStorage.setItem("Five", localStorage.getItem("Four"));
        localStorage.setItem("Four", localStorage.getItem("Three"));
        localStorage.setItem("Three", localStorage.getItem("Two"));
        localStorage.setItem("Two", playerScore);
        resetHighScores();
    }
    else if(playerScore > parseInt(localStorage.getItem("Three")))
    {
        alert("You got the Number 3 High Score!");
        localStorage.setItem("Five", localStorage.getItem("Four"));
        localStorage.setItem("Four", localStorage.getItem("Three"));
        localStorage.setItem("Three", playerScore);
        resetHighScores();
    }
    else if(playerScore > parseInt(localStorage.getItem("Four")))
    {
        alert("You got the Number 4 High Score!");
        localStorage.setItem("Five", localStorage.getItem("Four"));
        localStorage.setItem("Four", playerScore);
        resetHighScores();
    }
    else if(playerScore > parseInt(localStorage.getItem("Five")))
    {
        alert("You got the Number 5 High Score!");
        localStorage.setItem("Five", playerScore);
        resetHighScores();
    }
}

// This function rewrites the innerHTML of the high score list items
function resetHighScores()
{
    document.getElementById("highScore1").innerHTML = localStorage.getItem("One");
    document.getElementById("highScore2").innerHTML = localStorage.getItem("Two");
    document.getElementById("highScore3").innerHTML = localStorage.getItem("Three");
    document.getElementById("highScore4").innerHTML = localStorage.getItem("Four");
    document.getElementById("highScore5").innerHTML = localStorage.getItem("Five");
}
