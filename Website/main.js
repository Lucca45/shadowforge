"use strict"; 

function gaNaarGame () { 
    const invoer = document.getElementById("search").value.toLowerCase().trim(); 
    const games = {
        "snake": "snake/snake.html",
        "tetris": "tetris/tetris.html",
        "boter kaas en eieren": "boter/boterkaaseieren.html",
    };
    
    if (games[invoer]) {
        window.location.href = games[invoer];
    } else {
        alert("Game bestaat niet");
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const zoekveld = document.getElementById("search");
    const knop = document.querySelector(".search-balk button");

   if (zoekveld) { 
    zoekveld.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            gaNaarGame();
        }
    });
}

    if (knop) {
        knop.addEventListener("click", function() {
            gaNaarGame();
        });
    }
});