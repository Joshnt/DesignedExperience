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

    let scale = min(width / img.width, height / img.height);
    let w = img.width * scale;
    let h = img.height * scale;
    
    imageMode(CENTER);
    image(img, width / 2, height / 2, w, h);
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