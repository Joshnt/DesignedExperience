let socket;
let isPressed = false;
let allTouches = {};

function preload() {
  bg = loadImage("/assets/ColorWheel.png"); // fetched from public/assets/
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  socket = io.connect("https://designedexperience.onrender.com");

  socket.on("connect", () => {
    console.log("Connected");
    socket.emit("joinRoom", "input");
  });

  socket.on("touchesUpdate", (data) => {
      allTouches = data;
  });

  socket.on("roomFull", (data) => {
      showRoomFullPopup("Only 4 input users are allowed at a time.");
  });
}

function draw() {
    background(255); 
    image(bg, (width - bg.width) / 2, (height - bg.height) / 2);
    ellipseMode(CENTER,CENTER);

    Object.values(allTouches).forEach(value => {
      fill(0, 100);
      strokeWeight(0);
      ellipse(value.x, value.y, map(width/5, 0, width, width*0.1, width*0.3),  map(width/5, 0, width, width*0.1, width*0.3));
    });

  if(touches.length > 0){ 

    stroke(255);
    strokeWeight(4);
    fill(255, 100);
    
    
    ellipse(touches[0].x, touches[0].y, map(width/2, 0, width, width*0.1, width*0.3),  map(width/2, 0, width, width*0.1, width*0.3));
  
    if (touches.length > 0) {
      socket.emit("touches", {
        x: map(touches[0].x, 0, width, 0, 1),
        y: map(touches[0].y, 0, height, 0, 1)
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

function touchEnded(){
  return false; // Prevent default behavior
}

function showRoomFullPopup(message) {
  document.getElementById("popupMessage").textContent = message;
  document.getElementById("roomFullPopup").style.display = "flex";
}

document.getElementById("reloadBtn").addEventListener("click", () => {
    location.reload();
});