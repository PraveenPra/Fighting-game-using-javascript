//#region Sprite Class

class Sprite {
  // + we are putting args in 1 object so that the order of which should come first etc and dependencies are solved
  constructor({ position }) {
    // where is this sprite iniatialised
    this.position = position;
    this.width = 50;
    this.height = 150;
  }

  // how does the sprite look
  draw() {}

  update() {
    this.draw();
  }
}

//#endregion

//#region Fighter Class

class Fighter {
  // + we are putting args in 1 object so that the order of which should come first etc and dependencies are solved
  constructor({ position, velocity, lastkey, color = "red", offset }) {
    // where is this sprite iniatialised
    this.position = position;
    this.velocity = velocity;
    this.width = 50;
    this.height = 150;
    this.color = color;
    // if ur pressing mulitiple keys, we want the last pressed key to act above others
    this.lastkey = lastkey;

    // a rectange representing the attack detector - sword swipe etc
    this.attackBox = {
      // this attack box should always be on the player so its position updates with the player -- shallow copy we are making
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 100,
      height: 50,
      offset,
    };
    this.isAttacking;
    this.health = 100;
  }

  // how does the sprite look
  draw() {
    //character
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    //attackbox
    if (this.isAttacking) {
      c.fillStyle = "green";
      c.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      );
    }
  }

  update() {
    this.draw();

    this.attackBox.position.x = this.position.x - this.attackBox.offset.x;

    this.attackBox.position.y = this.position.y;
    // add gravity and movement - every frame increase downward movement and x movement based on own velocity .. instead of value 0 we selected self velocity 0 so each sprite fall is individually controlled

    this.position.x += this.velocity.x;

    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }
  }

  attack() {
    this.isAttacking = true;

    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }
}

//#endregion
