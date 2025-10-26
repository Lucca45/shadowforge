"use strict"; // controleert fouten beter

//functie om naar de game te gaan als je het opzoekt
function gaNaarGame () { 
    const invoer = document.getElementById("search").value.toLowerCase().trim(); 
    const games = {
        "snake": "snake/snake_site.html",
        "tetris": "tetris/tetris_site.html",
        "boter kaas en eieren": "boter/boterkaaseieren_site.html",
        "flappybird": "flappybird/flappybird.html"
    };
    // als er een game wordt ingevoerd die er niet is, dan foutmelding
    if (games[invoer]) {
        window.location.href = games[invoer];
    } else {
        alert("Game bestaat niet");
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const zoekveld = document.getElementById("search");
    const knop = document.querySelector(".search-balk button");

// als er iets is getypt dan luistert het naar de toets "Enter"
   if (zoekveld) { 
    zoekveld.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            gaNaarGame();
        }
    });
}
// als er een knop is dan reageren wanneer er wordt geklikt
    if (knop) {
        knop.addEventListener("click", function() {
            gaNaarGame();
        });
    }
});

// flappybird game 
document.addEventListener('DOMContentLoaded', () => {
// elementen van flappybird html geselecteerd
    const container = document.querySelector('.game-container');
    const bird = document.querySelector('.bird');
    const img = document.getElementById('bird1');
    const score_val = document.querySelector('.score_val');
    const score_title = document.querySelector('.score_title');
    const message = document.querySelector('.message');

    // zorgt voor begin message
    let game_state = 'Start';
    img.style.display = 'none';
    message.classList.add('messageStyle');

// variabelen voor het bewegen en voor de obstakels
    let gravity = 0.8;
    let jump_height = 12;
    let velocity = 0;
    let move_speed = 3;
    let pipe_separation = 0;
    let gap = 35;

// zorgt voor de besturing met het toetsenbord
    document.addEventListener('keydown', (e) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(e.key)) {
            e.preventDefault();
        }

        if(e.key === 'Enter' && game_state !== 'Play') {
            startGame();
        }

        if(e.key === 'ArrowUp' && game_state === 'Play') {
            velocity = -jump_height;
        }
    });

    function startGame() {

        container.querySelectorAll('.pipe_sprite').forEach(pipe => pipe.remove());

        // alles resetten
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

    // zorgt ervoor dat de vogel valt als je geen arrow in hebt getikt
    function applyGravity() {
        if(game_state !== 'Play') return;

        let bird_props = bird.getBoundingClientRect();
        if(!bird.style.top) bird.style.top = bird_props.top + 'px';

        let current_top = parseFloat(bird.style.top);

        velocity += gravity;
        bird.style.top = (current_top + velocity) + 'px';

        // voorkomt dat de vogel boven of onder het beeld vliegt
        if(current_top + velocity < 0) bird.style.top = '0px';
        if(current_top + velocity + bird_props.height > container.clientHeight) {
            bird.style.top = (container.clientHeight - bird_props.height) + 'px';
            gameOver();
            return;
        }

        requestAnimationFrame(applyGravity);
    }
// zorgt ervoor dat spel stopt als die een buis of de grond aanraakt
    function gameOver() {
        game_state = 'End';
        message.innerHTML = '<span style="color:red;">GAME OVER</span><br>Press Enter to restart';
        message.classList.add('messageStyle');
        img.style.display = 'none';
    }

    // zorgt voor bewegende pijpen
    function movePipes() {
        if(game_state !== 'Play') return;

        const bird_props = bird.getBoundingClientRect();

        container.querySelectorAll('.pipe_sprite').forEach(pipe => {
            const pipe_props = pipe.getBoundingClientRect();

            // controleert op een botsing
            if(bird_props.left < pipe_props.left + pipe_props.width &&
               bird_props.left + bird_props.width > pipe_props.left &&
               bird_props.top < pipe_props.top + pipe_props.height &&
               bird_props.top + bird_props.height > pipe_props.top) {
                gameOver();
            }

            // zorgt ervoor dat de score 1 omhoog gaat als die voorbij een pipe is geweest
            if(pipe_props.right < bird_props.left && pipe.increase_score === '1') {
                score_val.innerHTML = parseInt(score_val.innerHTML) + 1;
                pipe.increase_score = '0';
            }

            // pipe gaat naar links
            pipe.style.left = (pipe_props.left - move_speed) + 'px';

            // pipe uit beeld verwijderd
            if(pipe_props.right <= 0) pipe.remove();
        });

        requestAnimationFrame(movePipes);
    }

    function createPipes() {
        if(game_state !== 'Play') return;

        // na 115 frames komen nieuwe pipes
        pipe_separation++;
        if(pipe_separation > 115) {
            pipe_separation = 0;

            // willekeurige lengtes voor pipes
            const top_height = Math.floor(Math.random() * 40) + 10;
            const bottom_height = container.clientHeight - (top_height / 100 * container.clientHeight) - (gap / 100 * container.clientHeight);

            //bovenste pipe
            const top_pipe = document.createElement('div');
            top_pipe.className = 'pipe_sprite';
            top_pipe.style.height = top_height + 'vh';
            top_pipe.style.top = '0';
            top_pipe.style.left = '100%';
            top_pipe.increase_score = '0';
            container.appendChild(top_pipe);

            // onderste pipe
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
