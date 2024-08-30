const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height)

//--------------------------------
const gravity = 0.2;
// ----------------------------------

class Sprite {
    // + we are putting args in 1 object so that the order of which should come first etc and dependencies are solved
    constructor({ position, velocity }) {
        // where is this sprite iniatialised
        this.position = position
        this.velocity = velocity
        this.height = 150
    }

    // how does the sprite look
    draw() {
        c.fillStyle = "red";
        c.fillRect(this.position.x, this.position.y, 50, this.height);
    }

    update() {
        this.draw()

        // add gravity - every frame increase downward pull .. instead of value 0 we selected self velocity 0 so each sprite fall is individually controlled


        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0
        } else {
            this.velocity.y += gravity;
        }
    }
}

// ------------------------------------
// create a player and enemy
const player = new Sprite({
    position: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
})

// - player.draw(); ->this will only draw once initially. but we want it to draw everyframe so move it into update and put update in animation frame

const enemy = new Sprite({
    position: { x: 400, y: 100 },
    velocity: { x: 0, y: 0 },

})

// - enemy.draw();

// --------------------------------------
// create an infinite loop/animation loop to keep going on and on 

function animate() {
    // i want to call animate function infinitely
    window.requestAnimationFrame(animate)

    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)

    player.update()
    enemy.update()
}

animate()