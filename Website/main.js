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

document.addEventListener('DOMContentLoaded', () => {

    const container = document.querySelector('.game-container');
    const bird = document.querySelector('.bird');
    const img = document.getElementById('bird1');
    const score_val = document.querySelector('.score_val');
    const score_title = document.querySelector('.score_title');
    const message = document.querySelector('.message');

    let game_state = 'Start';
    img.style.display = 'none';
    message.classList.add('messageStyle');

    let gravity = 0.8;
    let jump_height = 12;
    let velocity = 0;
    let move_speed = 3;
    let pipe_separation = 0;
    let gap = 35;

    document.addEventListener('keydown', (e) => {
        if(e.key === 'Enter') e.preventDefault();
        if(e.key === 'ArrowUp') e.preventDefault();

        if(e.key === 'Enter' && game_state !== 'Play') {
            startGame();
        }

        if(e.key === 'ArrowUp' && game_state === 'Play') {
            velocity = -jump_height;
        }
    });

    function startGame() {

        container.querySelectorAll('.pipe_sprite').forEach(pipe => pipe.remove());

        img.style.display = 'block';
        bird.style.top = '40vh';
        velocity = 0;
        game_state = 'Play';
        pipe_separation = 0;

        message.innerHTML = '';
        score_title.innerHTML = 'Score : ';
        score_val.innerHTML = '0';
        message.classList.remove('messageStyle');

        requestAnimationFrame(applyGravity);
        requestAnimationFrame(movePipes);
        requestAnimationFrame(createPipes);
    }

    function applyGravity() {
        if(game_state !== 'Play') return;

        let bird_props = bird.getBoundingClientRect();
        if(!bird.style.top) bird.style.top = bird_props.top + 'px';

        let current_top = parseFloat(bird.style.top);

        velocity += gravity;
        bird.style.top = (current_top + velocity) + 'px';

        if(current_top + velocity < 0) bird.style.top = '0px';
        if(current_top + velocity + bird_props.height > container.clientHeight) {
            bird.style.top = (container.clientHeight - bird_props.height) + 'px';
            gameOver();
            return;
        }

        requestAnimationFrame(applyGravity);
    }

    function gameOver() {
        game_state = 'End';
        message.innerHTML = '<span style="color:red;">GAME OVER</span><br>Press Enter to restart';
        message.classList.add('messageStyle');
        img.style.display = 'none';
    }

    function movePipes() {
        if(game_state !== 'Play') return;

        const bird_props = bird.getBoundingClientRect();

        container.querySelectorAll('.pipe_sprite').forEach(pipe => {
            const pipe_props = pipe.getBoundingClientRect();

            if(bird_props.left < pipe_props.left + pipe_props.width &&
               bird_props.left + bird_props.width > pipe_props.left &&
               bird_props.top < pipe_props.top + pipe_props.height &&
               bird_props.top + bird_props.height > pipe_props.top) {
                gameOver();
            }

            if(pipe_props.right < bird_props.left && pipe.increase_score === '1') {
                score_val.innerHTML = parseInt(score_val.innerHTML) + 1;
                pipe.increase_score = '0';
            }

            pipe.style.left = (pipe_props.left - move_speed) + 'px';

            if(pipe_props.right <= 0) pipe.remove();
        });

        requestAnimationFrame(movePipes);
    }

    function createPipes() {
        if(game_state !== 'Play') return;

        pipe_separation++;
        if(pipe_separation > 115) {
            pipe_separation = 0;

            const top_height = Math.floor(Math.random() * 40) + 10;
            const bottom_height = container.clientHeight - (top_height / 100 * container.clientHeight) - (gap / 100 * container.clientHeight);

            const top_pipe = document.createElement('div');
            top_pipe.className = 'pipe_sprite';
            top_pipe.style.height = top_height + 'vh';
            top_pipe.style.top = '0';
            top_pipe.style.left = '100%';
            top_pipe.increase_score = '0';
            container.appendChild(top_pipe);

            const bottom_pipe = document.createElement('div');
            bottom_pipe.className = 'pipe_sprite';
            bottom_pipe.style.height = bottom_height + 'px';
            bottom_pipe.style.top = `calc(${top_height}vh + ${gap}vh)`;
            bottom_pipe.style.left = '100%';
            bottom_pipe.increase_score = '1';
            container.appendChild(bottom_pipe);
        }

        requestAnimationFrame(createPipes);
    }

});
