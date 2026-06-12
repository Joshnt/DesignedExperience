const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');

const app = express();
const server = createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

const MAX_INPUT_USERS = 4;
const inputUsers = new Set();

app.use(express.static(join(__dirname, 'public')));

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'public', 'input', 'index.html'));
  });

app.get('/input', (req, res) => {
    res.sendFile(join(__dirname, 'public', 'input', 'index.html'));
  });

app.get('/output', (req, res) => {
    res.sendFile(join(__dirname, 'public', 'output', 'index.html'));
  });


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

    inputUsers.forEach((socketId) => {
        const socket = io.sockets.sockets.get(socketId);
        if (!socket) return;

        const filtered = touches.filter(t => t.id !== socketId);

        socket.emit("touchesUpdate", {
            count: filtered.length,
            touches: filtered
        });
    });
}

// 6. Listen for new Socket.IO connections.
io.on("connection", (socket) => {
    console.log("New socket connected: " + socket.id);

    connectionOrder.push(socket.id);
    console.log(`socket connected: ${socket.id}`);

    socket.on("touches", (t) => {
        allTouches[socket.id] = t;
    });

    socket.on("touchEnd", () => {
        delete allTouches[socket.id];
    });

    socket.on("disconnect", () => {
        delete allTouches[socket.id];
        inputUsers.delete(socket.id);
        connectionOrder = connectionOrder.filter(id => id !== socket.id);
        console.log(`socket disconnected: ${socket.id}`);
    });

    socket.on("joinRoom", (roomName) => {
        if (roomName === "input") {

            if (inputUsers.size >= MAX_INPUT_USERS) {
                socket.emit("roomFull", {
                    title: "Too many users",
                    message: "Only 4 users are allowed at a time."
                });
                setTimeout(() => {
                    socket.disconnect(true);
                }, 500);
                console.log("room join deny");
                return;
            }

            inputUsers.add(socket.id);
        }

        socket.join(roomName);
        console.log(`Socket ${socket.id} joined room '${roomName}'`);
    });
});

setInterval(broadcastAll, 20);
