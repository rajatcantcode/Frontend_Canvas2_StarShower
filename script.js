import utils from "/utils.js";

var canvas = document.querySelector("canvas");
var c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const colors = ["#2185C5", "#7ECEFD", "#FFF6E5", "#FF7F66"];

/*
 * ------------------------------------------
 * *-----------------------------
 *  Design
 * *-----------------------------
 * ------------------------------------------
 */
//Star
class Star {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = { x: 0, y: 3 };
    this.gravity = 1;
    this.reducedAcceleration = 0.8;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  }

  update() {
    this.draw();
    //When ball hits the bottom of the screen
    //We are adding the velocity.y becuase we want the ball to be fully visible but
    //due to constant acceleration it some parts gets submerged into the ground
    if (this.y + this.radius + this.velocity.y > canvas.height) {
      //we will be decreaing the acceleration of the ball as they hit the bottom
      this.velocity.y = -this.velocity.y * this.reducedAcceleration;
      //When it hits the bottom it creates the miniStars with the help of fxn shatters
      this.shatters();
    } else {
      this.velocity.y += this.gravity;
    }

    this.y += this.velocity.y;
  }

  shatters() {
    //We want to make the big star when it hits the ground

    this.radius -= 5;

    for (let i = 0; i < 8; i++) {
      miniStars.push(new MiniStar(this.x, this.y, 2, "red"));
    }
    // console.log(miniStars);
  }
}

//MiniStar
class MiniStar extends Star {
  constructor(x, y, radius, color) {
    // using inheritance for cleaner code
    // Call the constructor of the parent class (Stars)
    super(x, y, radius, color);
    this.velocity = {
      x: utils.randomIntFromRange(-5, 5),
      y: utils.randomIntFromRange(-15, 15),
    };
    this.friction = 0.8;
    this.gravity = 0.3;
    this.ttl = 100; //time to live -> how many frames should mini stars should live
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  }

  update() {
    this.draw();
    //When ball hits the bottom of the screen
    //We are adding the velocity.y becuase we want the ball to be fully visible but
    //due to constant acceleration it some parts gets submerged into the ground
    if (this.y + this.radius + this.velocity.y > canvas.height) {
      //we will be decreaing the acceleration of the ball as they hit the bottom
      this.velocity.y = -this.velocity.y * this.reducedAcceleration;
    } else {
      this.velocity.y += this.gravity;
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.ttl -= 1;
  }
}

/*
 * ------------------------------------------
 * *-----------------------------
 *  Implementation
 * *-----------------------------
 * ------------------------------------------
 */
let stars;
let miniStars;
function init() {
  stars = [];
  miniStars = [];
  for (let i = 0; i < 1; i++) {
    stars.push(new Star(canvas.width / 2, 30, 30, "blue"));
  }
}
init();

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, window.innerWidth, window.innerHeight);
  stars.forEach((star, i) => {
    star.update();
    if (star.radius === 0) {
      stars.splice(i, 1); //index,how many stars to remove
    }
  });
  miniStars.forEach((miniStar, i) => {
    miniStar.update();
    if (miniStar.ttl === 0) {
      miniStars.splice(i, 1);
    }
  });
}
animate();

//resize
window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
});
