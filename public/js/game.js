import Player from "./classes/Player.js";
import Fruit from "./classes/Fruit.js";

import ScreenType from "./classes/ScreenType.js";
import Screens from "./classes/Screens.js";

let canvas = document.getElementById("game-canvas");
let ctx = canvas.getContext("2d");

let WIDTH, HEIGHT; // control canvas size
let player,
  fruit = [];

// Game Screens
var currentStageIndex = 1, // 0 for menu
  currentStage,
  stages = [];

var screenLose = new Screens("Player Lose", new ScreenType("lose"));
var screenPause = new Screens("Pause Game", new ScreenType("pause"));

// Sound Effects
const fruitSFX = new Audio("assets/audio/sfx/Fruit.wav");
const gameOverSFX = new Audio("assets/audio/sfx/Game_Over.ogg");
const hurtSFX = new Audio("assets/audio/sfx/Hurt.wav");

// Background Music
const stageBGM = new Audio("assets/audio/bgm/bgm01.mp3");
stageBGM.volume = 0.4;

var canPlay = true; // used for gameOverSFX

var scoreboard = document.getElementById("scoreboard"); // the DOM element below page's title
var previousScore = 0; // ah.. the previous score?

var scoreString;
var highscoreString;

var time = 100; // time in milliseconds

//// Observation: Player wins when score gets to 100 (but not yet)

window.onload = () => {
  initializeCanvas();
  window.gameStarted = true;

  document.addEventListener("keydown", keyPush);

  loadData("highscore");
  drawDOMElements(false);

  // run();
  setInterval(run, time);
};

function initializeCanvas() {
  WIDTH = 35;
  HEIGHT = 35;

  setupStages();
  currentStage = stages[0];

  player = new Player({
    HEIGHT,
    WIDTH,
    ctx,
  });

  for (let i = 0; i < 10; i++) {
    fruit = [...fruit, new Fruit(ctx)];
  }

  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  canvas.style.width = `${WIDTH * 16}px`;
  canvas.style.height = `${HEIGHT * 16}px`;
}

// Application Runner
function run() {
  update();
  render();

  window.score = player.getScore();
  window.highscore = player.getHighscore();
  // requestAnimationFrame(run);
}
// Game Updater Function
function update() {
  player.move();

  const { trail, headPos, score, highscore } = player.state;
  for (var i = 0; i < trail.length; i++) {
    // Lose (Touched your own body)
    if (trail[i].x == headPos.x && trail[i].y == headPos.y) {
      // Reset Snake stats
      player.setHeadPosition(0, 0);
      player.setBodyPosition(0, 0);
      player.state.lost = true;

      // Play Game Over Sound
      if (canPlay && player.state.lost) {
        play(hurtSFX);
        play(gameOverSFX);
        canPlay = false;
      } else if (canPlay && !player.state.lost) {
        stop(gameOverSFX);
        return;
      }

      if (score > highscore) {
        player.setHighscore(score);

        localStorage.setItem("snake-game.highscore", highscore.toString());
      }
    }
  }

  fruit.find((f) => {
    const fruitPos = f.state.position;
    const pos = player.state.headPos;
    if (pos.x === fruitPos.x && pos.y === fruitPos.y) {
      play(fruitSFX);
      player.checkCollision(f);
      f.reset();
    }
  });

  if (player.getScore() >= 50) {
    changeStage(stages[1]);
  }

  if (!isPlaying(stageBGM)) {
    player.state.lost ? stop(stageBGM) : play(stageBGM);
  }

  canvas.onclick = restartGame;
}

// Game Render Function
function render() {
  manageStages(currentStage);
  drawDOMElements(true);
  player.draw();

  fruit.forEach((f) => f.draw());
  // Change Screen when player has lost
  screens("lose");
}

// Input Controller //
function keyPush(event) {
  switch (event.code) {
    case "ArrowLeft": // Arrow Left
    case "KeyA": // A key
      if (!player.state.lost) player.setBodyPosition(-1, 0);
      break;
    case "ArrowUp": // up
    case "KeyW": // W key
      if (!player.state.lost) player.setBodyPosition(0, -1);
      break;
    case "ArrowRight": // right
    case "KeyD": // D key
      if (!player.state.lost) player.setBodyPosition(1, 0);
      break;
    case "ArrowDown": // down
    case "KeyS": // S key
      if (!player.state.lost) player.setBodyPosition(0, 1);
      break;

    case "Enter": // enter
    case "Space": // space
      restartGame();
      break;

    case "Escape": // escape
      history.back();
      break;
  }
}

// Reusable Functions //
function play(audio) {
  audio.play();
}

function stop(audio) {
  audio.pause();
  audio.currentTime = 0;
}

function isPlaying(audio) {
  if (audio.played) {
    return true;
  } else return false;
}

// Game Functions //
function screens(type) {
  // Player Lose Screen
  if (type === screenLose.getType().getName()) {
    if (player.state.lost) {
      ctx.fillStyle = "#222";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      ctx.fillStyle = "#FFF";
      ctx.fontSize = "5px";
      ctx.fillText("K.O.", 8.5, 20);
    }
  }
}

function drawDOMElements(update) {
  let score = player.getScore();
  let highscore = player.getHighscore();
  if (update) {
    // Update strings
    scoreString = "Score : " + score;
    score > highscore
      ? (highscoreString = "Highscore : " + score)
      : (highscoreString =
          "Highscore : " + localStorage.getItem("snake-game.highscore"));

    // Update DOM elements
    if (previousScore < score || previousScore === score) {
      var sr = document.createElement("h3");
      var hsr = document.createElement("h4");
      sr.innerHTML = `${scoreString}`;
      sr.style.textAlign = "center";
      sr.style.marginRight = "10px";
      sr.id = "score-info";

      hsr.innerHTML = `${highscoreString}`;
      hsr.style.textAlign = "center";
      hsr.style.marginRight = "10px";
      hsr.id = "score-info";

      if (score > highscore) {
        hsr.style.color = "#C8F225";
      } else {
        hsr.style.color = "#FFF";
      }

      scoreboard.removeChild(scoreboard.firstChild); // Score: ...
      scoreboard.removeChild(scoreboard.firstChild); // Highscore: ...
      scoreboard.appendChild(sr);
      scoreboard.appendChild(hsr);

      previousScore = score;
    }
  } else {
    // Initialize strings
    scoreString = "Score : " + score;
    highscoreString =
      "Highscore : " + localStorage.getItem("snake-game.highscore");

    // Shows score and highscore on top of the game canvas
    var sr = document.createElement("h2");
    var hsr = document.createElement("h4");

    sr.innerHTML = `${scoreString}`;
    sr.style.textAlign = "center";
    sr.style.marginRight = "10px";
    sr.id = "score-info";

    hsr.innerHTML = `${highscoreString}`;
    hsr.style.textAlign = "center";
    hsr.style.marginRight = "10px";
    hsr.id = "score-info";

    scoreboard.appendChild(sr);
    scoreboard.appendChild(hsr);
  }
}

function loadData(dataType) {
  if (dataType === "highscore") {
    // gets highscore from localStorage
    if (localStorage.getItem("snake-game.highscore") != null) {
      player.setHighscore(
        Number.parseInt(localStorage.getItem("snake-game.highscore"))
      );
    } else {
      localStorage.setItem(
        "snake-game.highscore",
        player.getHighscore().toString()
      );
    }
  }
}

function restartGame() {
  player.reset();
  fruit.forEach((f) => f.reset());
  previousScore = 0;
  canPlay = true;
}

function setupStages() {
  stages.push(new Screens("Arena 1", new ScreenType("stage")));
  stages[0].setRender(() => {
    ctx.fillStyle = "#FFF";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  });

  stages.push(new Screens("Arena 2", new ScreenType("stage")));
  stages[1].setRender(() => {
    ctx.fillStyle = "#50b0FF";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    player.setColor("#400ff2");
    // fruitDraw("#66700f");
  });
}

function manageStages(stage) {
  stage.getRender()();
}

function changeStage(to, stageIndex = 0) {
  stageIndex === 0 ? currentStageIndex++ : (currentStageIndex = stageIndex);
  currentStage = to;
}
