const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height)

//--------------------------------
const gravity = 0.7;
const keys = {
    a: { pressed: false },
    d: { pressed: false },
    w: { pressed: false },
    ArrowLeft: { pressed: false },
    ArrowRight: { pressed: false },
}



// ----------------------------------

class Sprite {
    // + we are putting args in 1 object so that the order of which should come first etc and dependencies are solved
    constructor({ position, velocity, lastkey }) {
        // where is this sprite iniatialised
        this.position = position
        this.velocity = velocity
        this.height = 150
        // if ur pressing mulitiple keys, we want the last pressed key to act above others
        this.lastkey = lastkey
    }

    // how does the sprite look
    draw() {
        c.fillStyle = "red";
        c.fillRect(this.position.x, this.position.y, 50, this.height);
    }

    update() {
        this.draw()

        // add gravity and movement - every frame increase downward movement and x movement based on own velocity .. instead of value 0 we selected self velocity 0 so each sprite fall is individually controlled

        this.position.x += this.velocity.x;

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

    //clear screen
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)

    //draw characters
    player.update()
    enemy.update()

    //player movement
    player.velocity.x = 0; //to stop pressing/moving
    if (keys.a.pressed && player.lastkey === 'a') {//moving/pressed
        player.velocity.x = -5
    } else if (keys.d.pressed && player.lastkey === 'd') {
        player.velocity.x = 5
    }

    //enemy movement
    enemy.velocity.x = 0; //to stop pressing/moving
    if (keys.ArrowLeft.pressed && enemy.lastkey === 'ArrowLeft') {//moving/pressed
        enemy.velocity.x = -5
    } else if (keys.ArrowRight.pressed && enemy.lastkey === 'ArrowRight') {
        enemy.velocity.x = 5
    }
}

animate()

// ------------------------------------ 
// moving player and enemy with event listeners 

window.addEventListener('keydown', (event) => {

    switch (event.key) {
        case 'd':
            keys.d.pressed = true;
            player.lastkey = 'd';
            break;
        case 'a':
            keys.a.pressed = true;
            player.lastkey = 'a'
            break;
        case 'w':
            player.velocity.y = -20;
            break;

        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            enemy.lastkey = 'ArrowRight';
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            enemy.lastkey = 'ArrowLeft'
            break;

        case 'ArrowUp':
            enemy.velocity.y = -20;
            break;
    }
})

window.addEventListener('keyup', (event) => {

    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break;
        case 'a':
            keys.a.pressed = false
            break;

    }
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break;

    }
})