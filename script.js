/* ==========================================
   FLORECENDO PASSOS
   JOGO 2D EDUCATIVO
========================================== */


/* ==========================================
   ELEMENTOS
========================================== */

const menu = document.getElementById("menu");
const instructions = document.getElementById("instructions");
const gameScreen = document.getElementById("gameScreen");
const victory = document.getElementById("victory");

const playButton = document.getElementById("playButton");
const instructionsButton = document.getElementById("instructionsButton");
const backButton = document.getElementById("backButton");

const restartButton = document.getElementById("restartButton");
const menuButton = document.getElementById("menuButton");

const player = document.getElementById("player");
const world = document.getElementById("world");

const scoreElement = document.getElementById("score");
const livesElement = document.getElementById("lives");
const questionsElement = document.getElementById("questions");

const questionModal = document.getElementById("questionModal");
const questionText = document.getElementById("questionText");
const answers = document.getElementById("answers");
const feedback = document.getElementById("feedback");

const messageModal = document.getElementById("messageModal");
const messageTitle = document.getElementById("messageTitle");
const messageText = document.getElementById("messageText");

const messageRestart = document.getElementById("messageRestart");
const messageMenu = document.getElementById("messageMenu");

const finalScore = document.getElementById("finalScore");
const correctQuestions = document.getElementById("correctQuestions");

const bestScore = document.getElementById("bestScore");

const leftControl = document.getElementById("leftControl");
const rightControl = document.getElementById("rightControl");
const jumpControl = document.getElementById("jumpControl");

const door = document.getElementById("door");


/* ==========================================
   CONFIGURAÇÃO DO MAPA
========================================== */

const WORLD_WIDTH = 3300;

const GROUND_HEIGHT = 100;

const PLAYER_WIDTH = 55;
const PLAYER_HEIGHT = 90;

const ENEMY_WIDTH = 70;
const ENEMY_HEIGHT = 65;

const COIN_WIDTH = 35;
const COIN_HEIGHT = 45;

const DOOR_X = 3180;
const DOOR_WIDTH = 90;


/* ==========================================
   ÁREAS COM CHÃO
========================================== */

const groundAreas = [

    {
        start: 0,
        end: 900
    },

    {
        start: 1020,
        end: 1550
    },

    {
        start: 1700,
        end: 2300
    },

    {
        start: 2450,
        end: 3050
    },

    {
        start: 3150,
        end: 3300
    }

];


/* ==========================================
   ESTADO DO JOGO
========================================== */

let game = createInitialGame();

let keys = {
    left: false,
    right: false
};

let lastTime = 0;

let animationFrame = null;

let answerLocked = false;


/* ==========================================
   PERGUNTAS
========================================== */

const challenges = [

    {
        question:
            "Ana tem 3 bolas. Ela ganha mais 2 bolas. Quantas bolas Ana tem agora?",

        options: [
            "4",
            "5",
            "6"
        ],

        correct: 1
    },

    {
        question:
            "Qual número vem depois do número 7?",

        options: [
            "6",
            "8",
            "9"
        ],

        correct: 1
    },

    {
        question:
            "Pedro tem 5 carrinhos. Ele dá 2 para seu amigo. Quantos carrinhos ficam com Pedro?",

        options: [
            "2",
            "3",
            "4"
        ],

        correct: 1
    },

    {
        question:
            "Complete a sequência: 2, 4, 6, 8, ?",

        options: [
            "9",
            "10",
            "12"
        ],

        correct: 1
    }

];


/* ==========================================
   CRIAR ESTADO INICIAL
========================================== */

function createInitialGame() {

    return {

        running: false,

        finished: false,

        dead: false,

        x: 120,

        y: GROUND_HEIGHT,

        velocityY: 0,

        speed: 6,

        gravity: 0.72,

        jumpForce: 14,

        jumping: false,

        onGround: true,

        lives: 3,

        score: 0,

        answered: 0,

        correct: 0,

        questionIndex: 0,

        camera: 0

    };

}


/* ==========================================
   CHÃO
========================================== */

function hasGroundAt(x) {

    return groundAreas.some(
        function(area) {

            return (
                x >= area.start &&
                x < area.end
            );

        }
    );

}


function playerHasGround() {

    const leftFoot =
        game.x + 8;

    const rightFoot =
        game.x + PLAYER_WIDTH - 8;

    return (
        hasGroundAt(leftFoot) &&
        hasGroundAt(rightFoot)
    );

}


/* ==========================================
   TECLADO
========================================== */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "ArrowLeft" ||
            event.key === "ArrowRight" ||
            event.key === "ArrowUp" ||
            event.key === " "
        ) {

            event.preventDefault();

        }


        if (event.key === "ArrowLeft") {

            keys.left = true;

        }


        if (event.key === "ArrowRight") {

            keys.right = true;

        }


        if (
            event.key === "ArrowUp" ||
            event.key === " "
        ) {

            jump();

        }

    }
);


document.addEventListener(
    "keyup",
    function(event) {

        if (event.key === "ArrowLeft") {

            keys.left = false;

        }


        if (event.key === "ArrowRight") {

            keys.right = false;

        }

    }
);


/* ==========================================
   NAVEGAÇÃO
========================================== */

function showScreen(screen) {

    document
        .querySelectorAll(".screen")
        .forEach(
            function(item) {

                item.classList.remove("active");

            }
        );

    screen.classList.add("active");

}


/* ==========================================
   BOTÕES
========================================== */

instructionsButton.addEventListener(
    "click",
    function() {

        showScreen(instructions);

    }
);


backButton.addEventListener(
    "click",
    function() {

        showScreen(menu);

    }
);


playButton.addEventListener(
    "click",
    startGame
);


restartButton.addEventListener(
    "click",
    startGame
);


messageRestart.addEventListener(
    "click",
    startGame
);


menuButton.addEventListener(
    "click",
    function() {

        stopGame();

        closeMessage();

        showScreen(menu);

    }
);


messageMenu.addEventListener(
    "click",
    function() {

        stopGame();

        closeMessage();

        showScreen(menu);

    }
);


/* ==========================================
   INICIAR JOGO
========================================== */

function startGame() {

    if (animationFrame) {

        cancelAnimationFrame(
            animationFrame
        );

        animationFrame = null;

    }


    game =
        createInitialGame();


    answerLocked = false;


    closeMessage();


    questionModal.classList.remove(
        "show"
    );


    resetCoins();

    resetEnemies();

    resetChallenges();


    player.style.left =
        game.x + "px";


    player.style.bottom =
        game.y + "px";


    world.style.transform =
        "translateX(0px)";


    updateHUD();


    showScreen(gameScreen);


    game.running = true;


    lastTime =
        performance.now();


    animationFrame =
        requestAnimationFrame(
            gameLoop
        );

}


/* ==========================================
   PARAR JOGO
========================================== */

function stopGame() {

    game.running = false;


    keys.left = false;
    keys.right = false;


    if (animationFrame) {

        cancelAnimationFrame(
            animationFrame
        );

        animationFrame = null;

    }

}


/* ==========================================
   LOOP PRINCIPAL
========================================== */

function gameLoop(timestamp) {

    if (!game.running) {

        return;

    }


    const delta =
        Math.min(
            (timestamp - lastTime) / 16.666,
            2
        );


    lastTime =
        timestamp;


    updatePlayer(delta);

    checkCoins();

    checkEnemies();

    checkChallenges();

    checkFinish();

    updateCamera();


    animationFrame =
        requestAnimationFrame(
            gameLoop
        );

}


/* ==========================================
   MOVIMENTO DO JOGADOR
========================================== */

function updatePlayer(delta) {

    let movement = 0;


    if (keys.left) {

        movement -=
            game.speed * delta;

    }


    if (keys.right) {

        movement +=
            game.speed * delta;

    }


    game.x += movement;


    if (game.x < 0) {

        game.x = 0;

    }


    if (
        game.x >
        WORLD_WIDTH - PLAYER_WIDTH
    ) {

        game.x =
            WORLD_WIDTH - PLAYER_WIDTH;

    }


    /*
       Gravidade.
    */

    game.velocityY -=
        game.gravity * delta;


    game.y +=
        game.velocityY * delta;


    /*
       Verifica pouso no chão.
    */

    if (
        game.velocityY <= 0 &&
        game.y <= GROUND_HEIGHT
    ) {

        if (playerHasGround()) {

            game.y =
                GROUND_HEIGHT;

            game.velocityY = 0;

            game.jumping = false;

            game.onGround = true;

        } else {

            game.onGround = false;

        }

    } else {

        game.onGround = false;

    }


    /*
       Caiu no vazio.
    */

    if (
        game.y < -PLAYER_HEIGHT
    ) {

        fallDown();

        return;

    }


    player.style.left =
        game.x + "px";


    player.style.bottom =
        game.y + "px";

}


/* ==========================================
   PULO
========================================== */

function jump() {

    if (!game.running) {

        return;

    }


    if (
        game.onGround &&
        !game.jumping
    ) {

        game.velocityY =
            game.jumpForce;

        game.jumping = true;

        game.onGround = false;

    }

}


/* ==========================================
   CÂMERA
========================================== */

function updateCamera() {

    const gameArea =
        document.getElementById("game");


    const screenWidth =
        gameArea.clientWidth;


    let camera =
        game.x -
        screenWidth / 2 +
        PLAYER_WIDTH / 2;


    if (camera < 0) {

        camera = 0;

    }


    const maxCamera =
        Math.max(
            0,
            WORLD_WIDTH - screenWidth
        );


    if (camera > maxCamera) {

        camera = maxCamera;

    }


    game.camera =
        camera;


    world.style.transform =
        `translateX(${-camera}px)`;

}


/* ==========================================
   MOEDAS
========================================== */

/*
   Esta versão usa colisão por
   retângulos, em vez de comparar
   apenas o centro do jogador.

   Isso corrige o problema de moedas
   que não eram coletadas corretamente.
*/

function checkCoins() {

    const coins =
        document.querySelectorAll(".coin");


    coins.forEach(
        function(coin) {

            if (
                coin.dataset.collected === "true"
            ) {

                return;

            }


            const coinX =
                Number(coin.dataset.x);


            /*
               A moeda fica 135px acima
               da base do mundo.
            */

            const coinY = 135;


            const coinRect = {

                left: coinX,

                right:
                    coinX + COIN_WIDTH,

                bottom: coinY,

                top:
                    coinY + COIN_HEIGHT

            };


            const playerRect = {

                left: game.x,

                right:
                    game.x + PLAYER_WIDTH,

                bottom: game.y,

                top:
                    game.y + PLAYER_HEIGHT

            };


            const collision =
                playerRect.left <
                    coinRect.right &&

                playerRect.right >
                    coinRect.left &&

                playerRect.bottom <
                    coinRect.top &&

                playerRect.top >
                    coinRect.bottom;


            if (!collision) {

                return;

            }


            collectCoin(coin);

        }
    );

}


/* ==========================================
   COLETAR MOEDA
========================================== */

function collectCoin(coin) {

    coin.dataset.collected =
        "true";


    coin.classList.add(
        "collected"
    );


    /*
       Pequeno efeito antes de desaparecer.
    */

    setTimeout(
        function() {

            coin.style.display =
                "none";

        },
        80
    );


    game.score += 10;


    updateHUD();

}


/* ==========================================
   RESETAR MOEDAS
========================================== */

function resetCoins() {

    document
        .querySelectorAll(".coin")
        .forEach(
            function(coin) {

                coin.dataset.collected =
                    "false";


                coin.classList.remove(
                    "collected"
                );


                coin.style.display =
                    "block";

            }
        );

}


/* ==========================================
   INIMIGOS
========================================== */

function checkEnemies() {

    const enemies =
        document.querySelectorAll(".enemy");


    enemies.forEach(
        function(enemy) {

            if (
                enemy.dataset.defeated ===
                "true"
            ) {

                return;

            }


            const enemyX =
                Number(enemy.dataset.x);


            const enemyLeft =
                enemyX;


            const enemyRight =
                enemyX +
                ENEMY_WIDTH;


            const enemyBottom =
                GROUND_HEIGHT;


            const enemyTop =
                enemyBottom +
                ENEMY_HEIGHT;


            const playerLeft =
                game.x;


            const playerRight =
                game.x +
                PLAYER_WIDTH;


            const playerBottom =
                game.y;


            const playerTop =
                game.y +
                PLAYER_HEIGHT;


            /*
               Colisão horizontal.
            */

            const horizontalCollision =
                playerLeft < enemyRight &&
                playerRight > enemyLeft;


            /*
               Colisão vertical.
            */

            const verticalCollision =
                playerBottom < enemyTop &&
                playerTop > enemyBottom;


            if (
                !horizontalCollision ||
                !verticalCollision
            ) {

                return;

            }


            /*
               Pisão.

               O jogador precisa estar
               descendo e seus pés precisam
               estar próximos do topo.
            */

            const stompCollision =
                game.velocityY <= 0 &&

                playerBottom >=
                    enemyTop - 25 &&

                playerBottom <=
                    enemyTop + 15;


            if (stompCollision) {

                defeatEnemy(enemy);

                return;

            }


            /*
               Colisão lateral.
            */

            loseLife();

        }
    );

}


/* ==========================================
   DERROTAR MONSTRO
========================================== */

function defeatEnemy(enemy) {

    enemy.dataset.defeated =
        "true";


    enemy.classList.add(
        "defeated"
    );


    setTimeout(
        function() {

            enemy.style.display =
                "none";

        },
        120
    );


    game.velocityY =
        game.jumpForce * 0.65;


    game.jumping = true;

    game.onGround = false;


    game.score += 25;


    updateHUD();

}


/* ==========================================
   RESETAR INIMIGOS
========================================== */

function resetEnemies() {

    document
        .querySelectorAll(".enemy")
        .forEach(
            function(enemy) {

                enemy.dataset.defeated =
                    "false";


                enemy.classList.remove(
                    "defeated"
                );


                enemy.style.display =
                    "block";

            }
        );

}


/* ==========================================
   PERDER VIDA
========================================== */

function loseLife() {

    if (!game.running) {

        return;

    }


    game.lives--;


    if (game.lives < 0) {

        game.lives = 0;

    }


    updateHUD();


    showLoseMessage(
        "VOCÊ PERDEU!",
        "Você encostou na lateral de um monstro. A aventura será reiniciada."
    );

}


/* ==========================================
   QUEDA NO VAZIO
========================================== */

function fallDown() {

    if (!game.running) {

        return;

    }


    game.dead = true;

    game.running = false;


    showLoseMessage(
        "VOCÊ CAIU!",
        "Você pisou em um vazio do cenário. A aventura será reiniciada."
    );

}


/* ==========================================
   DERROTA
========================================== */

function showLoseMessage(
    title,
    text
) {

    game.running = false;


    keys.left = false;
    keys.right = false;


    messageTitle.textContent =
        title;


    messageText.textContent =
        text;


    messageModal.classList.add(
        "show"
    );

}


/* ==========================================
   FECHAR MENSAGEM
========================================== */

function closeMessage() {

    messageModal.classList.remove(
        "show"
    );

}


/* ==========================================
   DESAFIOS
========================================== */

function checkChallenges() {

    if (!game.running) {

        return;

    }


    const blocks =
        document.querySelectorAll(
            ".challenge-block"
        );


    blocks.forEach(
        function(block) {

            if (
                block.dataset.completed ===
                "true"
            ) {

                return;

            }


            const index =
                Number(
                    block.dataset.challenge
                );


            /*
               Os desafios precisam
               ser respondidos em ordem.
            */

            if (
                index !== game.answered
            ) {

                return;

            }


            const blockX =
                Number(
                    block.dataset.x
                );


            const blockLeft =
                blockX;


            const blockRight =
                blockX + 55;


            const blockBottom =
                155;


            const blockTop =
                blockBottom + 55;


            const playerLeft =
                game.x;


            const playerRight =
                game.x + PLAYER_WIDTH;


            const playerBottom =
                game.y;


            const playerTop =
                game.y + PLAYER_HEIGHT;


            const horizontal =
                playerLeft < blockRight &&
                playerRight > blockLeft;


            const vertical =
                playerBottom < blockTop &&
                playerTop > blockBottom;


            if (
                horizontal &&
                vertical
            ) {

                openChallenge(index);

            }

        }
    );

}


/* ==========================================
   ABRIR DESAFIO
========================================== */

function openChallenge(index) {

    if (!game.running) {

        return;

    }


    game.running = false;


    game.questionIndex =
        index;


    answerLocked = false;


    const challenge =
        challenges[index];


    questionText.textContent =
        challenge.question;


    answers.innerHTML =
        "";


    feedback.textContent =
        "";


    challenge.options.forEach(
        function(option, optionIndex) {

            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "answer";


            button.textContent =
                option;


            button.addEventListener(
                "click",
                function() {

                    answerChallenge(
                        index,
                        optionIndex
                    );

                }
            );


            answers.appendChild(
                button
            );

        }
    );


    questionModal.classList.add(
        "show"
    );

}


/* ==========================================
   RESPONDER DESAFIO
========================================== */

function answerChallenge(
    questionIndex,
    answerIndex
) {

    if (answerLocked) {

        return;

    }


    answerLocked = true;


    const challenge =
        challenges[questionIndex];


    const buttons =
        document.querySelectorAll(
            ".answer"
        );


    buttons.forEach(
        function(button) {

            button.disabled = true;

        }
    );


    game.answered++;


    if (
        answerIndex ===
        challenge.correct
    ) {

        game.correct++;

        game.score += 50;


        feedback.textContent =
            "Resposta correta! Muito bem!";


        feedback.style.color =
            "#238443";

    } else {

        game.score += 10;


        feedback.textContent =
            "Essa não foi a resposta. Vamos continuar!";


        feedback.style.color =
            "#c56a20";

    }


    const block =
        document.querySelector(
            `.challenge-block[data-challenge="${questionIndex}"]`
        );


    if (block) {

        block.dataset.completed =
            "true";


        block.classList.add(
            "collected"
        );


        block.textContent =
            "OK";

    }


    updateHUD();


    setTimeout(
        function() {

            questionModal.classList.remove(
                "show"
            );


            answerLocked = false;


            game.running = true;


            lastTime =
                performance.now();


            animationFrame =
                requestAnimationFrame(
                    gameLoop
                );

        },
        1000
    );

}


/* ==========================================
   RESETAR DESAFIOS
========================================== */

function resetChallenges() {

    document
        .querySelectorAll(
            ".challenge-block"
        )
        .forEach(
            function(block) {

                block.dataset.completed =
                    "false";


                block.classList.remove(
                    "collected"
                );


                block.textContent =
                    "?";

            }
        );

}


/* ==========================================
   FINAL
========================================== */

function checkFinish() {

    if (!game.running) {

        return;

    }


    /*
       A porta só abre depois
       dos quatro desafios.
    */

    if (
        game.answered < 4
    ) {

        return;

    }


    const playerLeft =
        game.x;


    const playerRight =
        game.x +
        PLAYER_WIDTH;


    const doorLeft =
        DOOR_X;


    const doorRight =
        DOOR_X +
        DOOR_WIDTH;


    const touchingDoor =
        playerRight >= doorLeft &&
        playerLeft <= doorRight;


    if (touchingDoor) {

        winGame();

    }

}


/* ==========================================
   VITÓRIA
========================================== */

function winGame() {

    if (game.finished) {

        return;

    }


    game.finished = true;

    game.running = false;


    finalScore.textContent =
        game.score;


    correctQuestions.textContent =
        game.correct;


    saveBestScore();


    showScreen(victory);

}


/* ==========================================
   HUD
========================================== */

function updateHUD() {

    scoreElement.textContent =
        game.score;


    livesElement.textContent =
        game.lives;


    questionsElement.textContent =
        game.answered;

}


/* ==========================================
   MELHOR PONTUAÇÃO
========================================== */

function saveBestScore() {

    const oldScore =
        Number(
            localStorage.getItem(
                "professoraBestScore"
            )
        ) || 0;


    if (
        game.score > oldScore
    ) {

        localStorage.setItem(
            "professoraBestScore",
            game.score
        );

    }


    showBestScore();

}


function showBestScore() {

    const score =
        Number(
            localStorage.getItem(
                "professoraBestScore"
            )
        ) || 0;


    bestScore.textContent =
        "Melhor pontuação: " +
        score;

}


showBestScore();


/* ==========================================
   CONTROLES MOBILE
========================================== */

function startLeft(event) {

    event.preventDefault();

    keys.left = true;

}


function stopLeft(event) {

    event.preventDefault();

    keys.left = false;

}


function startRight(event) {

    event.preventDefault();

    keys.right = true;

}


function stopRight(event) {

    event.preventDefault();

    keys.right = false;

}


leftControl.addEventListener(
    "touchstart",
    startLeft,
    {
        passive: false
    }
);


leftControl.addEventListener(
    "touchend",
    stopLeft,
    {
        passive: false
    }
);


leftControl.addEventListener(
    "touchcancel",
    stopLeft,
    {
        passive: false
    }
);


rightControl.addEventListener(
    "touchstart",
    startRight,
    {
        passive: false
    }
);


rightControl.addEventListener(
    "touchend",
    stopRight,
    {
        passive: false
    }
);


rightControl.addEventListener(
    "touchcancel",
    stopRight,
    {
        passive: false
    }
);


jumpControl.addEventListener(
    "touchstart",
    function(event) {

        event.preventDefault();

        jump();

    },
    {
        passive: false
    }
);


/* ==========================================
   CONTROLES COM MOUSE
========================================== */

leftControl.addEventListener(
    "mousedown",
    function() {

        keys.left = true;

    }
);


leftControl.addEventListener(
    "mouseup",
    function() {

        keys.left = false;

    }
);


leftControl.addEventListener(
    "mouseleave",
    function() {

        keys.left = false;

    }
);


rightControl.addEventListener(
    "mousedown",
    function() {

        keys.right = true;

    }
);


rightControl.addEventListener(
    "mouseup",
    function() {

        keys.right = false;

    }
);


rightControl.addEventListener(
    "mouseleave",
    function() {

        keys.right = false;

    }
);


jumpControl.addEventListener(
    "mousedown",
    function() {

        jump();

    }
);


/* ==========================================
   LIMPAR CONTROLES
========================================== */

window.addEventListener(
    "blur",
    function() {

        keys.left = false;

        keys.right = false;

    }
);