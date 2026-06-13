let bg;

function preload() {
  bg = loadImage("/assets/ENTRY copy.jpg"); // fetched from public/assets/
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  frameRate(30);
}

function draw() {
    background(255); 
    imageMode(CENTER);

    image(
      bg,
      width/2,
      height/2
    );
}

function touchEnded() {
  return false; // Prevent default behavior
}

function touchStarted(){
  window.location.href = "https://designedexperience.onrender.com/input";
  return false; // Prevent default behavior
}

function windowResized() {
  // = ignore rotation 
}