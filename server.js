const express = require('express');
//const basicAuth = require('express-basic-auth');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');

const app = express();
const server = createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(join(__dirname, 'public')));

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
