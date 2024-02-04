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
// Objects
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
    } else {
      this.velocity.y += this.gravity;
    }

    this.y += this.velocity.y;
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
function init() {
  stars = [];
  for (let i = 0; i < 2; i++) {
    stars.push(new Star(canvas.width / 2, 30, 30, "blue"));
  }
}
init();

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, window.innerWidth, window.innerHeight);
  stars.forEach((star) => {
    star.update();
  });
}
animate();

//resize
window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
