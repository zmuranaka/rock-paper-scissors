"use strict";

/*
File: burgerNav.js
Zachary Muranaka
Allows the burger nav (for mobile view) to work
*/

var burgerNav = document.getElementById("burgerNav");
var navBar = document.getElementById("navBar");
var anchorArray = document.getElementsByClassName("loseFloat"); // Array of anchor tags with the class "loseFloat"
var menuIsOpen = false; // Boolean value that keeps track of whether the menu is open or not

burgerNav.addEventListener("click", burgerNavClicked);

// If the menu is open, it closes it, and if it is closed, it opens it
function burgerNavClicked()
{
    if(menuIsOpen) closeNavMenu();
    else openNavMenu();
}

function closeNavMenu()
{
    navBar.style.display = "none";
    menuIsOpen = false; // The menu is now closed
}

function openNavMenu()
{
    navBar.style.display = "block";

    // Remove the float from all of the anchor tags in the anchorArray
    for(let i = 0; i < anchorArray.length; i++)
        anchorArray[i].style.float = "none";

    menuIsOpen = true; // The menus is now open
}
