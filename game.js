class Space {
  constructor(image, y) {
    this.x = 0;
    this.y = y;
    this.loaded = false;

    this.image = new Image();

    var obj = this;

    this.image.addEventListener('load', function () {
      obj.loaded = true;
    });

    this.image.src = image;
  }

  Update(space) {
    this.y += speed; //The image will move down with every frame

    if (this.y > window.innerHeight) {
      //if the image left the screen, it will change it's position
      this.y = space.y - canvas.width + speed; //New position depends on the second Road object
    }
  }
}

class Ship {
  constructor(image, x, y, isPlayer) {
    this.x = x;
    this.y = y;
    this.loaded = false;
    this.dead = false;
    this.isPlayer = isPlayer;

    this.image = new Image();

    var obj = this;

    this.image.addEventListener('load', function () {
      obj.loaded = true;
    });

    this.image.src = image;
  }

  Update() {
    if (!this.isPlayer) {
      this.y += speed;
    }

    if (this.y > canvas.height + 50) {
      this.dead = true;
    }
  }

  Collide(ship) {
    var hit = false;

    if (
      this.y < ship.y + ship.image.height * scale &&
      this.y + this.image.height * scale > ship.y
    ) {
      //If there is collision by y
      if (
        this.x + this.image.width * scale > ship.x &&
        this.x < ship.x + ship.image.width * scale
      ) {
        //If there is collision by x
        hit = true;
      }
    }

    return hit;
  }

  Move(v, d) {
    if (v == 'x') {
      //Moving on x
      d *= 2;

      this.x += d; //Changing position

      //Rolling back the changes if the ship left the screen
      if (this.x + this.image.width * scale > canvas.width) {
        this.x -= d;
      }

      if (this.x < 0) {
        this.x = 0;
      }
    } //Moving on y
    else {
      this.y += d;

      if (this.y + this.image.height * scale > canvas.height) {
        this.y -= d;
      }

      if (this.y < 0) {
        this.y = 0;
      }
    }
  }
}

const UPDATE_TIME = 1000 / 60;

var timer = null;

var canvas = document.getElementById('canvas'); //Getting the canvas from DOM
var ctx = canvas.getContext('2d'); //Getting the context to work with the canvas

var scale = 0.1; //Ships scale

Resize(); //Changing the canvas size on startup

window.addEventListener('resize', Resize); //Change the canvas size with the window size

//Forbidding openning the context menu to make the game play better on mobile devices
canvas.addEventListener('contextmenu', function (e) {
  e.preventDefault();
  return false;
});

window.addEventListener('keydown', function (e) {
  KeyDown(e);
}); //Listenning for keyboard events

var objects = []; //Game objects

var spaces = [
  new Space('images/space.jpg', 0),
  new Space('images/space.jpg', canvas.width),
]; //Backgrounds

var player = new Ship(
  'images/ship.png',
  canvas.width / 2,
  canvas.height / 2,
  true
); //Player's object

var speed = 5;
let highscore = 0;

Start();

function Start() {
  if (!player.dead) {
    timer = setInterval(Update, UPDATE_TIME); //Updating the game 60 times a second
  }
}

function Stop() {
  clearInterval(timer); //Game stop
  timer = null;
}

function Update() {
  spaces[0].Update(spaces[1]);
  spaces[1].Update(spaces[0]);

  if (RandomInteger(0, 10000) > 9700) {
    //Generating new meteor
    let rand = Math.floor(Math.random() * 3);
    let str = 'images/meteor1.png';

    switch (rand) {
      case 0:
        str = 'images/meteor1.png';
        break;
      case 1:
        str = 'images/meteor2.png';
        break;
      case 2:
        str = 'images/meteor3.png';
        break;
      default:
        str = 'images/meteor2.png';
    }
    objects.push(
      new Ship(
        str,
        RandomInteger(30, canvas.width - 50),
        RandomInteger(250, 400) * -1,
        false
      )
    );
  }

  player.Update();

  if (player.dead) {
    alert('Crash!');
    Stop();
  }

  var isDead = false;

  for (var i = 0; i < objects.length; i++) {
    objects[i].Update();

    if (objects[i].dead) {
      isDead = true;
    }
  }

  if (isDead) {
    objects.shift();
  }

  var hit = false;

  highscore += 1;

  for (var i = 0; i < objects.length; i++) {
    hit = player.Collide(objects[i]);

    if (hit) {
      alert(
        'Crash! Your highscore = ' + highscore + '\n Press (Space) to restart !'
      );
      Stop();
      player.dead = true;
      break;
    }
  }

  Draw();
}

function Draw() {
  //Working with graphics
  ctx.clearRect(0, 0, canvas.width, canvas.height); //Clearing the canvas

  for (var i = 0; i < spaces.length; i++) {
    ctx.drawImage(
      spaces[i].image, //Image
      0, //First X on image
      0, //First Y on image
      spaces[i].image.width, //End X on image
      spaces[i].image.height, //End Y on image
      spaces[i].x, //X on canvas
      spaces[i].y, //Y on canvas
      canvas.width, //Width on canvas
      canvas.width //Height on canvas
    );
  }

  DrawShip(player);

  for (var i = 0; i < objects.length; i++) {
    DrawShip(objects[i]);
  }
}

function DrawShip(ship) {
  ctx.drawImage(
    ship.image,
    0,
    0,
    ship.image.width,
    ship.image.height,
    ship.x,
    ship.y,
    ship.image.width * scale,
    ship.image.height * scale
  );
}

function KeyDown(e) {
  switch (e.keyCode) {
    case 37: //Left
      player.Move('x', -speed);
      break;

    case 39: //Right
      player.Move('x', speed);
      break;

    case 38: //Up
      player.Move('y', -speed);
      break;

    case 40: //Down
      player.Move('y', speed);
      break;

    case 32: //Reload page(restart)
      document.location.reload();
      break;

    case 27: //Esc
      if (timer == null) {
        Start();
      } else {
        Stop();
      }
      break;
  }
}

function Resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function RandomInteger(min, max) {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}
