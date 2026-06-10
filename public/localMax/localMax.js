const Max = require('max-api');

let socket;

socket = io.connect("https://designx-color.onrender.com");

socket.on("connect", () => {
console.log("Connected");

socket.emit("joinRoom", "output");
});

socket.on("touchesUpdate", (data) => {
    // data = { count, touches }

    post("touches count: " + data.count + "\n");

    data.touches.forEach(t => {
        post(`touch ${t.index}: ${t.x}, ${t.y}\n`);
    });

    // send to Max outlets
    outlet(0, data.count);
    outlet(1, JSON.stringify(data.touches));
});