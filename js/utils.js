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
