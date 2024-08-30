const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

//--------------------------------
const gravity = 0.7;
const keys = {
  a: { pressed: false },
  d: { pressed: false },
  w: { pressed: false },
  ArrowLeft: { pressed: false },
  ArrowRight: { pressed: false },
};

//#region Create Player & Enemy
const player = new Fighter({
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 0 },
  offset: { x: 0, y: 0 },
});

// - player.draw(); ->this will only draw once initially. but we want it to draw everyframe so move it into update and put update in animation frame

const enemy = new Fighter({
  position: { x: 400, y: 100 },
  velocity: { x: 0, y: 0 },
  color: "blue",
  offset: { x: 50, y: 0 },
});
//#endregion

//#region Collision
function rectangularCollision({ rectange1, rectange2 }) {
  return (
    rectange1.attackBox.position.x + rectange1.attackBox.width >=
      rectange2.position.x &&
    rectange1.attackBox.position.x <= rectange2.position.x + rectange2.width &&
    rectange1.attackBox.position.y + rectange1.attackBox.height >=
      rectange2.position.y &&
    rectange1.attackBox.position.y <= rectange2.position.y + rectange2.height
  );
}
//#endregion

//#region Winner
function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId);
  let d = document.querySelector("#displayText");
  d.style.display = "flex";
  if (player.health === enemy.health) {
    d.innerHTML = "TIE";
  } else if (player.health > enemy.health) {
    d.innerHTML = "Player 1 wins";
  } else if (player.health < enemy.health) {
    d.innerHTML = "Player 2 Wins";
  }
}
//#endregion

//#region  Timer
let timer = 30;
let timerId;
function decreaseTimer() {
  //game over : when timer runs out

  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector("#timer").innerHTML = timer;
  }
  if (timer === 0) {
    determineWinner({ player, enemy, timerId });
  }
}
decreaseTimer();
//#endregion

//#region Animate
// create an infinite loop/animation loop to keep going on and on

function animate() {
  // i want to call animate function infinitely
  window.requestAnimationFrame(animate);

  //clear screen
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  //draw characters
  player.update();
  enemy.update();

  //player movement
  player.velocity.x = 0; //to stop pressing/moving
  if (keys.a.pressed && player.lastkey === "a") {
    //moving/pressed
    player.velocity.x = -5;
  } else if (keys.d.pressed && player.lastkey === "d") {
    player.velocity.x = 5;
  }

  //enemy movement
  enemy.velocity.x = 0; //to stop pressing/moving
  if (keys.ArrowLeft.pressed && enemy.lastkey === "ArrowLeft") {
    //moving/pressed
    enemy.velocity.x = -5;
  } else if (keys.ArrowRight.pressed && enemy.lastkey === "ArrowRight") {
    enemy.velocity.x = 5;
  }

  //detect collision
  //logic : our right side of attackbox shud be greater or equal to the left side of enemy position and also the left side of the player shud not be less than the right side of the enemy

  //same on y axis the bottom of player attackbox shud not be upper than the top of enemy. ie when player jump above the enemy , he cant detect collision

  if (
    rectangularCollision({
      rectange1: player,
      rectange2: enemy,
    }) &&
    player.isAttacking
  ) {
    player.isAttacking = false;
    enemy.health -= 20;
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }

  if (
    rectangularCollision({
      rectange1: enemy,
      rectange2: player,
    }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    player.health -= 20;
    document.querySelector("#playerHealth").style.width = player.health + "%";
  }

  //game over : when the health goes out
  if (player.health <= 0 || enemy.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}

animate();
//#endregion
// ------------------------------------
// moving player and enemy with event listeners
//#region Keys
window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = true;
      player.lastkey = "d";
      break;
    case "a":
      keys.a.pressed = true;
      player.lastkey = "a";
      break;
    case "w":
      player.velocity.y = -20;
      break;
    case " ":
      player.attack();
      break;

    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      enemy.lastkey = "ArrowRight";
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      enemy.lastkey = "ArrowLeft";
      break;

    case "ArrowUp":
      enemy.velocity.y = -20;
      break;
    case "ArrowDown":
      enemy.attack();
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
  }
  switch (event.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});
//#endregion
