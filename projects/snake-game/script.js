const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const statusEl = document.getElementById("status");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const quitBtn = document.getElementById("quitBtn");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake;
let dx;
let dy;
let food;
let score;
let gameRunning = false;
let gameInterval = null;
let countdownActive = false;

function initGame() {
  snake = [{ x: 10 * gridSize, y: 10 * gridSize }];
  dx = gridSize;
  dy = 0;
  score = 0;
  food = generateFood();
  updateScore();
  updateStatus("Ready");
  draw();
}

function generateFood() {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * tileCount) * gridSize,
      y: Math.floor(Math.random() * tileCount) * gridSize
    };
  } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));

  return newFood;
}

function updateScore() {
  scoreEl.textContent = score;
}

function updateStatus(text) {
  statusEl.textContent = text;
}

document.addEventListener("keydown", changeDirection);

function changeDirection(e) {
  if (!gameRunning || countdownActive) return;

  if (e.key === "ArrowLeft" && dx === 0) {
    dx = -gridSize;
    dy = 0;
  } else if (e.key === "ArrowUp" && dy === 0) {
    dx = 0;
    dy = -gridSize;
  } else if (e.key === "ArrowRight" && dx === 0) {
    dx = gridSize;
    dy = 0;
  } else if (e.key === "ArrowDown" && dy === 0) {
    dx = 0;
    dy = gridSize;
  }
}

function startGame() {
  if (gameRunning) return;

  updateStatus("Starting...");

  startCountdown(() => {
    gameRunning = true;
    updateStatus("Playing");

    gameInterval = setInterval(() => {
      update();
      draw();
    }, 110);
  });
}

function restartGame() {
  clearInterval(gameInterval);
  gameRunning = false;

  restartBtn.style.display = "none";
  initGame();

  updateStatus("Starting...");

  startCountdown(() => {
    gameRunning = true;
    updateStatus("Playing");

    gameInterval = setInterval(() => {
      update();
      draw();
    }, 110);
  });
}

function quitGame() {
  window.close();

  setTimeout(() => {
    window.location.href = "../../index.html";
  }, 150);
}

function update() {
  const head = {
    x: snake[0].x + dx,
    y: snake[0].y + dy
  };

  const hitWall =
    head.x < 0 ||
    head.x >= canvas.width ||
    head.y < 0 ||
    head.y >= canvas.height;

  const hitSelf = snake.some(segment => segment.x === head.x && segment.y === head.y);

  if (hitWall || hitSelf) {
    clearInterval(gameInterval);
    gameRunning = false;
    updateStatus("Game Over");
    drawGameOver();
    restartBtn.style.display = "inline-block";
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    updateScore();
    food = generateFood();
  } else {
    snake.pop();
  }
}

function drawGrid() {
  ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
  ctx.lineWidth = 1;

  for (let i = 0; i <= canvas.width; i += gridSize) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(canvas.width, i);
    ctx.stroke();
  }
}

function drawSnake() {
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? "#c084ff" : "#7c3aed";
    ctx.beginPath();
    ctx.roundRect(segment.x + 1, segment.y + 1, gridSize - 2, gridSize - 2, 6);
    ctx.fill();
  });
}

function drawFood() {
  ctx.fillStyle = "#ff5c8a";
  ctx.beginPath();
  ctx.arc(food.x + gridSize / 2, food.y + gridSize / 2, gridSize / 2.7, 0, Math.PI * 2);
  ctx.fill();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  drawFood();
  drawSnake();
}

function drawGameOver() {
  draw();

  ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 30px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 10);

  ctx.font = "18px Arial";
  ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 24);
}
function startCountdown(callback) {
  let count = 3;
  countdownActive = true;

  function drawCountdown() {
    draw(); // draw game behind

    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 50px Arial";
    ctx.textAlign = "center";

    ctx.fillText(count > 0 ? count : "GO!", canvas.width / 2, canvas.height / 2);
  }

  const interval = setInterval(() => {
    drawCountdown();
    count--;

    if (count < -1) {
      clearInterval(interval);
      countdownActive = false;
      callback(); // start actual game
    }
  }, 800); // speed of countdown
}

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);
quitBtn.addEventListener("click", quitGame);

initGame();