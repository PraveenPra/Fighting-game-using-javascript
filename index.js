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
const background = new Sprite({
  position: { x: 0, y: 0 },
  imageSrc: "./assets/background/background_layer_1.png",
  //   width: canvas.width,
  //   height: canvas.height,
  scale: 4,
});

const shop = new Sprite({
  position: { x: 600, y: 315 },
  imageSrc: "./assets/decorations/shop_anim.png",
  scale: 2,
  framesMax: 6,
});

//#region Player & Enemy
const player = new Fighter({
  position: { x: 0, y: 250 },
  velocity: { x: 0, y: 0 },
  offset: { x: 0, y: 0 },
  imageSrc: "./assets/character/samuraiMack/Run.png",
  framesMax: 8,
  scale: 2,
  offset: { x: 5, y: 0 },
  sprites: {
    idle: {
      imageSrc: "./assets/character/samuraiMack/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./assets/character/samuraiMack/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./assets/character/samuraiMack/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./assets/character/samuraiMack/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./assets/character/samuraiMack/Attack1.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "./assets/character/samuraiMack/TakeHitwhite.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "./assets/character/samuraiMack/Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    //offset till the sword distance i need the attackbox to hit enemy
    offset: { x: -200, y: -150 },
    width: 160,
    height: 50,
  },
});

// - player.draw(); ->this will only draw once initially. but we want it to draw everyframe so move it into update and put update in animation frame

const enemy = new Fighter({
  position: { x: 400, y: 250 },
  velocity: { x: 0, y: 0 },
  color: "blue",
  offset: { x: 50, y: 0 },
  imageSrc: "./assets/character/samuraiMack/Idle.png",
  framesMax: 8,
  scale: 2,
  offset: { x: 5, y: 0 },
  sprites: {
    idle: {
      imageSrc: "./assets/character/samuraiMack/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./assets/character/samuraiMack/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./assets/character/samuraiMack/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./assets/character/samuraiMack/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./assets/character/samuraiMack/Attack1.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "./assets/character/samuraiMack/TakeHitWhite.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "./assets/character/samuraiMack/Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: { x: -300, y: -150 },
    width: 80,
    height: 50,
  },
});
//#endregion

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
  background.update();
  shop.update();

  //to make our player move visible than background
  c.fillStyle = "rgba(255, 255, 255, 0.15)";
  c.fillRect(0, 0, canvas.width, canvas.height);

  //ground
  c.fillStyle = "brown";
  c.fillRect(0, 570, canvas.width, canvas.height);

  player.update();
  enemy.update();

  //only for testing
  // drawGrid();

  //#region movement
  player.velocity.x = 0; //to stop pressing/moving
  if (keys.a.pressed && player.lastkey === "a") {
    //moving/pressed
    player.velocity.x = -5;
    player.switchSprite("run");
  } else if (keys.d.pressed && player.lastkey === "d") {
    player.velocity.x = 5;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }

  //jump
  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  //enemy movement
  enemy.velocity.x = 0; //to stop pressing/moving
  if (keys.ArrowLeft.pressed && enemy.lastkey === "ArrowLeft") {
    //moving/pressed
    enemy.velocity.x = -5;
    enemy.switchSprite("run");
  } else if (keys.ArrowRight.pressed && enemy.lastkey === "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }

  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }
  //#endregion
  //# region collision
  //logic : our right side of attackbox shud be greater or equal to the left side of enemy position and also the left side of the player shud not be less than the right side of the enemy

  //same on y axis the bottom of player attackbox shud not be upper than the top of enemy. ie when player jump above the enemy , he cant detect collision

  if (
    rectangularCollision({
      rectange1: player,
      rectange2: enemy,
    }) &&
    player.isAttacking &&
    player.framesCurrent === 4 //dont want to reduce health before animation finished
  ) {
    enemy.takeHit();
    player.isAttacking = false;

    // document.querySelector("#enemyHealth").style.width = enemy.health + "%";
    gsap.to("#enemyHealth", {
      width: enemy.health + "%",
    });
  }
  //if player misses attack
  if (player.isAttacking && player.framesCurrent === 6) {
    player.isAttacking = false;
  }

  if (
    rectangularCollision({
      rectange1: enemy,
      rectange2: player,
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 4
  ) {
    player.takeHit();
    enemy.isAttacking = false;

    // document.querySelector("#playerHealth").style.width = player.health + "%";
    gsap.to("#playerHealth", {
      width: player.health + "%",
    });
  }

  //#endregion
  //if enemy misses attack
  if (enemy.isAttacking && enemy.framesCurrent === 6) {
    enemy.isAttacking = false;
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
  if (!player.dead) {
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
    }
  }

  if (!enemy.dead) {
    switch (event.key) {
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
