const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height)

// ----------------------------------

class Sprite {
    constructor(position) {
        // where is this sprite iniatialised
        this.position = position
    }

    // how does the sprite look
    draw() {
        c.fillStyle = "red";
        c.fillRect(this.position.x, this.position.y, 50, 150);
    }
}

// ------------------------------------
// create a player and enemy
const player = new Sprite({ x: 0, y: 0 })

player.draw();

const enemy = new Sprite({ x: 400, y: 100 })

enemy.draw();

// --------------------------------------
// create an infinite loop/animation loop to keep going on and on 

function animate() {
    // i want to call animate function infinitely
    window.requestAnimationFrame(animate)
}

animate()