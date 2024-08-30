//#region Sprite Class

class Sprite {
  // + we are putting args in 1 object so that the order of which should come first etc and dependencies are solved
  constructor({
    position,
    imageSrc,
    scale = 1,
    framesMax = 1,
    framesCurrent = 0,
    framesHold = 5,
    offset = { x: 0, y: 0 },
  }) {
    // where is this sprite iniatialised
    this.position = position;
    this.width = 50;
    this.height = 100;
    this.image = new Image(); //create an img tag through js object property
    this.image.src = imageSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    this.framesCurrent = framesCurrent; //to make background image start at 0,0
    this.framesElapsed = 0; //hw mny frames have been moved/animated
    this.framesHold = framesHold; //speed of sprite animation - for every 10 frame move to next frame
    this.offset = offset;
  }

  // how does the sprite look
  draw() {
    c.drawImage(
      this.image,
      this.framesCurrent * (this.image.width / this.framesMax), //this will result in 0 for backgrnd images and calculate next frame for anim images
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    );
  }

  animateFrames() {
    this.framesElapsed++;

    if (this.framesElapsed % this.framesHold === 0) {
      //sprite animation
      //-1 because for backgnd images it flikkers the screen
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
      } else {
        this.framesCurrent = 0;
      }
    }
  }
  update() {
    this.draw();
    this.animateFrames();
  }
}

//#endregion

//#region Fighter Class

class Fighter extends Sprite {
  // + we are putting args in 1 object so that the order of which should come first etc and dependencies are solved
  constructor({
    position,
    velocity,
    lastkey,
    color = "red",
    imageSrc,
    scale = 1,
    framesMax = 1,
    framesCurrent = 0,
    framesHold = 5,
    offset = { x: 0, y: 0 },
    sprites,
  }) {
    // where is this sprite iniatialised
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      framesCurrent,
      framesHold,
      offset,
    });
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
    this.sprites = sprites;

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
  }

  update() {
    this.draw();
    this.animateFrames();

    this.attackBox.position.x = this.position.x - this.attackBox.offset.x;

    this.attackBox.position.y = this.position.y;
    // add gravity and movement - every frame increase downward movement and x movement based on own velocity .. instead of value 0 we selected self velocity 0 so each sprite fall is individually controlled

    this.position.x += this.velocity.x;

    this.position.y += this.velocity.y;

    //96 is ground height
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
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
