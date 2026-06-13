let bg;

function preload() {
  bg = loadImage("/assets/ENTRY copy.jpg"); // fetched from public/assets/
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  frameRate(30);
}

function draw() {
    imageMode(CENTER);

    let scale = max(width / bg.width, height / bg.height);
    let w = bg.width * scale;
    let h = bg.height * scale;
    
    imageMode(CENTER);
    image(bg, width / 2, height / 2, w, h);
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