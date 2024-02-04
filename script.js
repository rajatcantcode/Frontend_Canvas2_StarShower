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
    this.velocity = { x: utils.randomIntFromRange(-4, 4), y: 3 };
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
    if (this.y + this.radius + this.velocity.y > canvas.height - groundHeight) {
      //we will be decreaing the acceleration of the ball as they hit the bottom
      this.velocity.y = -this.velocity.y * this.reducedAcceleration;
      //When it hits the bottom it creates the miniStars with the help of fxn shatters
      this.shatters();
    } else {
      this.velocity.y += this.gravity;
    }

    //Hits side of the screen
    if (
      this.x + this.radius + this.velocity.x > canvas.width ||
      this.x - this.radius <= 0
    ) {
      this.velocity.x = -this.velocity.x * this.friction;
      this.shatters();
    }
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }

  shatters() {
    //We want to make the big star when it hits the ground

    this.radius -= 5;

    for (let i = 0; i < 8; i++) {
      miniStars.push(new MiniStar(this.x, this.y, 3));
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
    this.ttl = 150; //time to live -> how many frames should mini stars should live
    this.opacity = 1;
  }

  draw() {
    c.save();
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = `rgba(227, 234,239,${this.opacity})`;
    c.shadowColor = "#E3EAEF";
    c.shadowBlur = 20;
    c.fill();
    c.closePath();
    c.restore();
  }

  update() {
    this.draw();
    //When ball hits the bottom of the screen
    //We are adding the velocity.y becuase we want the ball to be fully visible but
    //due to constant acceleration it some parts gets submerged into the ground
    if (this.y + this.radius + this.velocity.y > canvas.height - groundHeight) {
      //we will be decreaing the acceleration of the ball as they hit the bottom
      this.velocity.y = -this.velocity.y * this.reducedAcceleration;
    } else {
      this.velocity.y += this.gravity;
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.ttl -= 1;
    this.opacity -= 1 / this.tll;
  }
}

//MoutainRange
function createMountainRange(mountainAmount, height, color) {
  for (var i = 0; i < mountainAmount; i++) {
    var mountainWidth = canvas.width / mountainAmount;

    // Draw triangle
    c.beginPath();
    c.moveTo(i * mountainWidth, canvas.height);
    c.lineTo(i * mountainWidth + mountainWidth + 325, canvas.height);

    // Triangle peak
    c.lineTo(i * mountainWidth + mountainWidth / 2, canvas.height - height);
    c.lineTo(i * mountainWidth - 325, canvas.height);
    c.fillStyle = color;
    c.fill();
    c.closePath();
  }
}

/*
 * ------------------------------------------
 * *-----------------------------
 *  Implementation
 * *-----------------------------
 * ------------------------------------------
 */
var backgroundGradient = c.createLinearGradient(0, 0, 0, canvas.height);
backgroundGradient.addColorStop(0, "#0f2d4e"); // Darker blue
backgroundGradient.addColorStop(1, "#4c729e"); // Lighter blue

let stars;
let miniStars;
let backgroundStars;
let ticker = 0; //this is going to helps us in shoot stars
let randomSpawner = 75;
var groundHeight = canvas.height * 0.15;

function init() {
  stars = [];
  miniStars = [];
  backgroundStars = [];
  for (let i = 0; i < 1; i++) {
    stars.push(new Star(canvas.width / 2, 30, 30, "#E3EAEF"));
  }

  for (let i = 0; i < 150; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = Math.random() * 3;
    backgroundStars.push(new Star(x, y, radius, "white"));
  }
}
init();

function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = backgroundGradient;
  c.fillRect(0, 0, window.innerWidth, window.innerHeight);

  //background Stars
  backgroundStars.forEach((star) => {
    star.draw();
  });
  //Moutains
  createMountainRange(1, canvas.height - 50, "#8B4513"); // Brown
  createMountainRange(2, canvas.height - 100, "#D2B48C"); // Tan
  createMountainRange(3, canvas.height - 300, "#C7212A"); // Dark Reddish Brown

  //ground
  c.fillStyle = "#182028";
  c.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);

  //Big Stars
  stars.forEach((star, i) => {
    star.update();
    if (star.radius === 0) {
      stars.splice(i, 1); //index,how many stars to remove
    }
  });

  //Shattered Stars
  miniStars.forEach((miniStar, i) => {
    miniStar.update();
    if (miniStar.ttl === 0) {
      miniStars.splice(i, 1);
    }
  });
  ticker++;

  if (ticker % randomSpawner === 0) {
    const radius = 30;
    const x = Math.max(radius, Math.random() * canvas.width - radius);
    stars.push(new Star(x, -100, radius, "#E3EAEF"));
    randomSpawner = utils.randomIntFromRange(75, 400);
  }
}
animate();

//resize
window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
});
