// Print a startup message on the server console
console.log("Starting server...");

// 1. Import Express and create an application instance.
const express = require("express");
const app = express();

// 2. Define the port using the environment variable (for Render) or default to 3000.
const port = process.env.PORT || 3000;

// 3. Start an HTTP server using the Express app.
const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}!`);
});

// 4. Set up Express to serve static files from the "public" directory.
app.use(express.static("public"));

// Route: /controller-a ➝ index-a.html
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/input/index.html");
});

// Route: /controller-b ➝ index-b.html
app.get("/output", (req, res) => {
    res.sendFile(__dirname + "/public/output/index.html");
});

// 5. Import and initialize Socket.IO with the created server.
const socketio = require("socket.io");
const io = socketio(server);


let allTouches = {};      // { socketID: {x, y} }
let connectionOrder = []; // ordered list of socketIDs by join time

function broadcastAll() {
    const touches = Object.keys(allTouches).map((id, index) => ({
        index: index + 1,
        id,
        x: allTouches[id].x,
        y: allTouches[id].y
    }));

    io.to("output").emit("touchesUpdate", {
        count: touches.length,
        touches
    });
}

// 6. Listen for new Socket.IO connections.
io.on("connection", (socket) => {
    console.log("New client connected: " + socket.id);

    connectionOrder.push(client.id);
    console.log(`Client connected: ${client.id}`);

    socket.on("touches", (t) => {
        allTouches[client.id] = t;
        broadcastAll();
    });

    socket.on("touchEnd", () => {
        delete allTouches[client.id];
        broadcastAll();
    });

    socket.on("disconnect", () => {
        delete allTouches[client.id];
        connectionOrder = connectionOrder.filter(id => id !== client.id);
        broadcastAll();
        console.log(`Client disconnected: ${client.id}`);
    });

    // Listen for a "maxClient" event which signals that this socket is the Max client.
    socket.on("joinRoom", (roomName) => {
        socket.join(roomName);
        console.log(`Socket ${socket.id} joined room '${roomName}'`);
    });
});
