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
    constructor({ position, velocity, lastkey, color = 'red',offset }) {
        // where is this sprite iniatialised
        this.position = position
        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.color = color
        // if ur pressing mulitiple keys, we want the last pressed key to act above others
        this.lastkey = lastkey

        // a rectange representing the attack detector - sword swipe etc
        this.attackBox = {
            // this attack box should always be on the player so its position updates with the player -- shallow copy we are making
            position: {
                x:this.position.x,
                y:this.position.y
            },
            width: 100,
            height: 50,
            offset
        }
        this.isAttacking
        this.health = 100
    }

    // how does the sprite look
    draw() {
        //character
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height);

        //attackbox
        if(this.isAttacking){
        c.fillStyle = 'green'
        c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
        }
    }

    update() {
        this.draw()

        this.attackBox.position.x = this.position.x -this.attackBox.offset.x

        this.attackBox.position.y = this.position.y
        // add gravity and movement - every frame increase downward movement and x movement based on own velocity .. instead of value 0 we selected self velocity 0 so each sprite fall is individually controlled

        this.position.x += this.velocity.x;

        this.position.y += this.velocity.y;

       

        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0
        } else {
            this.velocity.y += gravity;
        }
    }

    attack(){
        this.isAttacking = true

        setTimeout(() => {
          this.isAttacking = false  
        }, 100);
    }
}

// ------------------------------------
// create a player and enemy
const player = new Sprite({
    position: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    offset:{x:0,y:0}
})

// - player.draw(); ->this will only draw once initially. but we want it to draw everyframe so move it into update and put update in animation frame

const enemy = new Sprite({
    position: { x: 400, y: 100 },
    velocity: { x: 0, y: 0 },
    color: 'blue',
    offset:{x:50,y:0}

})

// - enemy.draw();


// -----------------------------
function rectangularCollision({rectange1,rectange2}){
    return (
        rectange1.attackBox.position.x + rectange1.attackBox.width >= rectange2.position.x && rectange1.attackBox.position.x <= rectange2.position.x + rectange2.width
        && rectange1.attackBox.position.y + rectange1.attackBox.height >= rectange2.position.y && rectange1.attackBox.position.y <= rectange2.position.y + rectange2.height
    
    )
}
//--------------------------------
function determineWinner({player,enemy,timerId}){
    cleardddddddddTimeout(timerId)
    let d = document.querySelector('#displayText')
    d.style.display = 'flex'
    if(player.health === enemy.health){
        d.innerHTML = 'TIE'
    }else if(player.health > enemy.health){
  d.innerHTML = 'Player 1 wins'
    }else if(player.health < enemy.health){
  d.innerHTML = 'Player 2 Wins'
    }
}
// -----------------------------------
let timer = 30
let timerId
function decreaseTimer(){
//game over : when timer runs out
    
    if(timer > 0){
      timerId =  setTimeout(decreaseTimer,1000)
        timer--
        document.querySelector('#timer').innerHTML = timer
    }
    if(timer === 0){
  determineWinner({player,enemy,timerId});
}
}
decreaseTimer();
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

    //detect collision
    //logic : our right side of attackbox shud be greater or equal to the left side of enemy position and also the left side of the player shud not be less than the right side of the enemy

    //same on y axis the bottom of player attackbox shud not be upper than the top of enemy. ie when player jump above the enemy , he cant detect collision

    if( rectangularCollision({
        rectange1:player,
        rectange2:enemy
    })
        && player.isAttacking){
        player.isAttacking = false
        enemy.health -= 20;
document.querySelector('#enemyHealth').style.width = enemy.health + '%';
    }

    if( rectangularCollision({
        rectange1:enemy,
        rectange2:player
    })
        && enemy.isAttacking){
        enemy.isAttacking = false
        player.health -= 20;
        document.querySelector('#playerHealth').style.width = player.health + '%';
    }

    //game over : when the health goes out
    if(player.health <= 0 || enemy.health <=0){
        determineWinner({player,enemy,timerId});

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
            case ' ':
            player.attack();
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
            case 'ArrowDown':
                enemy.attack()
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