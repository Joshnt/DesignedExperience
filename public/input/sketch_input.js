let socket;
let isPressed = false;
let allTouches = [];

// Define circle from your layout
let cx;
let cy;
let padding;
let r;


function mapTouchToCircle(tx, ty) {
  // Vector from center to touch
  let dx = tx - cx;
  let dy = ty - cy;
  
  // Clamp to circle boundary
  let dist = sqrt(dx * dx + dy * dy);
  if (dist > r) {
    dx = (dx / dist) * r;
    dy = (dy / dist) * r;
  }
  
  // Normalize to 0–1
  return {
    x: (dx + r) / (2 * r),   // 0 = left edge, 1 = right edge
    y: (dy + r) / (2 * r)    // 0 = top edge, 1 = bottom edge
  };
}

function preload() {
  bg = loadImage("/assets/COLOR WHEEL copy.jpg"); // fetched from public/assets/
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  socket = io.connect("https://designedexperience.onrender.com");

  socket.on("connect", () => {
    console.log("Connected");
    socket.emit("joinRoom", "input");
  });

  socket.on("touchesUpdate", (data) => {
      allTouches = data.touches;
  });

  socket.on("roomFull", (data) => {
      showRoomFullPopup("Only 4 users are allowed at a time.");
  });

  cx = width / 2;
  cy = height / 2;
  padding = 0;
  r = width / 2 - padding; // your left-to-right circle

  frameRate(60); // limit to 60fps for update rate
}

function draw() {
    imageMode(CENTER);

    let scale = max(width / bg.width, height / bg.height);
    let w = bg.width * scale;
    let h = bg.height * scale;
    
    imageMode(CENTER);
    image(bg, width / 2, height / 2, w, h);

    ellipseMode(CENTER,CENTER);
    console.log(allTouches.length);

    allTouches.forEach(touch => {
        fill(0, 100);
        noStroke();
        let temp = mapTouchToCircle(touch.x, touch.y);

        ellipse(
            temp.x * width,
            temp.y * height,
            map(width/5, 0, width, width*0.1, width*0.3),
            map(width/5, 0, width, width*0.1, width*0.3)
        );
    });

  if(touches.length > 0){ 

    stroke(255);
    strokeWeight(4);
    fill(255, 100);
    
    
    ellipse(touches[0].x, touches[0].y, map(width/2, 0, width, width*0.1, width*0.3),  map(width/2, 0, width, width*0.1, width*0.3));
  
    if (touches.length > 0) {

      let newPos= mapTouchToCircle(touches[0].x, touches[0].y);

      socket.emit("touches", {
        x: newPos.x,
        y: newPos.y
      });
    }
  }
}

function touchEnded() {
  if (touches.length === 0) {
    socket.emit("touchEnd");
  }
  return false;
}

function touchStarted(){
  return false; // Prevent default behavior
}

function showRoomFullPopup(message) {
  document.getElementById("popupMessage").textContent = message;
  document.getElementById("roomFullPopup").style.display = "flex";
}

document.getElementById("reloadBtn").addEventListener("click", () => {
    location.reload();
});

function windowResized() {
  // = ignore rotation 
}