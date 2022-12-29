let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 700;
document.body.appendChild(canvas);

let backgroundImage, spaceShipImage, bulletImage, enemyImage, gameOverImage;
let gameOver = false;
let score = 0;

// 우주선 좌표
let spaceshipX = canvas.width / 2 - 30;
let spaceshipY = canvas.height - 60;

let bulletList = [];

function Bullet() {
  this.x = 0;
  this.y = 0;
  this.init = function () {
    this.x = spaceshipX + 18;
    this.y = spaceshipY - 18;
    this.alive = true;

    bulletList.push(this);
  };
  this.update = function () {
    this.y -= 7;
  };
  this.checkHit = function () {
    for (let i = 0; i < enemyList.length; i++) {
      if (
        this.y <= enemyList[i].y &&
        this.x >= enemyList[i].x &&
        this.x <= enemyList[i].x + 40
      ) {
        score++;
        this.alive = false;
        enemyList.splice(i, 1);
      }
    }
  };
}

function generateRandomValue(min, max) {
  let ramdomNum = Math.floor(Math.random() * (max - min + 1)) + min;
  return ramdomNum;
}

let enemyList = [];

function Eneymy() {
  this.x = 0;
  this.y = 0;
  this.init = function () {
    this.y = 0;
    this.x = generateRandomValue(0, canvas.width - 100);
    enemyList.push(this);
  };
  this.update = function () {
    this.y += 1;

    if (this.y >= canvas.height - 40) {
      gameOver = true;
    }
  };
}

function loadImage() {
  backgroundImage = new Image();
  backgroundImage.src = "images/background.jpg";

  spaceShipImage = new Image();
  spaceShipImage.src = "images/spaceship.png";

  bulletImage = new Image();
  bulletImage.src = "images/bullet.png";

  enemyImage = new Image();
  enemyImage.src = "images/enemy.png";

  gameOverImage = new Image();
  gameOverImage.src = "images/gameover.jpg";
}

let keysDown = {};

function setupKeyboardListener() {
  document.addEventListener("keydown", function (event) {
    keysDown[event.keyCode] = true;
  });
  document.addEventListener("keyup", function (event) {
    delete keysDown[event.keyCode];
    if (event.keyCode == 32) {
      createBullet();
    }
  });
}

function createBullet() {
  console.log("총알 생성");
  let b = new Bullet();
  b.init();
  console.log("새로운 총알 리스트", bulletList);
}

function createEnemy() {
  const interval = setInterval(function () {
    let e = new Eneymy();
    e.init();
  }, 1000);
}

function update() {
  if (39 in keysDown) {
    spaceshipX += 5;
  }
  if (37 in keysDown) {
    spaceshipX -= 5;
  }
  if (38 in keysDown) {
    spaceshipY -= 5;
  }
  if (40 in keysDown) {
    spaceshipY += 5;
  }

  if (spaceshipX <= 0) {
    spaceshipX = 0;
  }
  if (spaceshipX >= canvas.width - 60) {
    spaceshipX = canvas.width - 60;
  }
  if (spaceshipY >= canvas.height - 60) {
    spaceshipY = canvas.height - 60;
  }
  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      bulletList[i].update();
      bulletList[i].checkHit();
    }
  }
  for (let i = 0; i < enemyList.length; i++) {
    enemyList[i].update();
  }
}

function renderImage() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(spaceShipImage, spaceshipX, spaceshipY);
  ctx.fillText(`Score : ${score}`, 20, 20);
  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
    }
  }
  for (let i = 0; i < enemyList.length; i++) {
    ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y, 60, 60);
  }
}

function main() {
  if (!gameOver) {
    update();
    renderImage();
    requestAnimationFrame(main);
  } else {
    ctx.drawImage(gameOverImage, 10, 100, 380, 380);
  }
}

loadImage();
setupKeyboardListener();
createEnemy();
main();
