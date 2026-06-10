const Max = require('max-api');
const io = require("socket.io-client");

let socket;

socket = io.connect("https://designedexperience.onrender.com");

socket.on("connect", () => {

socket.emit("joinRoom", "output");
});

socket.on("touchesUpdate", (data) => {
    data.touches.forEach(t => {
        Max.outlet("touch", t.index, t.x, t.y);
    });

    Max.outlet("count", data.count)
});