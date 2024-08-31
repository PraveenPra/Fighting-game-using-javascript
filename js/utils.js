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

//#region draw grid lines

// Draw grid lines
function drawGrid(gridSize = 50, color = "green") {
  const width = canvas.width;
  const height = canvas.height;

  // Set the stroke color for the grid lines
  c.strokeStyle = "green";
  c.font = "12px Arial"; // Set the font for the numbers
  c.fillStyle = color; // Set the color for the text
  // Draw vertical grid lines
  for (let x = gridSize; x < width; x += gridSize) {
    // let x = gridSize;
    c.beginPath();
    c.moveTo(x, 0);
    c.lineTo(x, height);
    c.stroke();
    // Draw the number for the x-axis
    c.fillText(`x${x}`, x + 2, 12); // Adjust the position to avoid overlap with the grid line
  }

  // Draw horizontal grid lines
  for (let y = gridSize; y < height; y += gridSize) {
    c.beginPath();
    c.moveTo(0, y);
    c.lineTo(width, y);
    c.stroke();
    c.fillText(`y${y}`, 2, y - 2); // Adjust the position to avoid overlap with the grid line
  }
}

// Call the function to draw the grid

//#endregion
