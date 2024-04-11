const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io"); // Import the Server class from socket.io
const io = new Server(server); // Initialize Socket.IO with the server

server.listen(4007, () => {
  console.log('Server is running on http://localhost:4007');
});

app.get('/', (req, res) => {
    // Make sure the path to your index.html is correct. If it's in the same directory, this will work.
    res.sendFile(__dirname + '/index.html');
});

var users = [];
var connections = [];
var online=0;

// Socket.IO server side connection
io.on('connection', (socket) => {
    connections.push(socket);
    online ++;
    console.log("On", online);

    io.sockets.emit('onu', online); // Отправляем количество онлайн пользователей клиенту

    socket.on('disconnect', (data) => {
        connections.splice(connections.indexOf(socket), 1);
        online --;
        console.log("Off", online);
        io.sockets.emit('onu', online); // Отправляем обновленное количество онлайн пользователей
    });

    socket.on('send mess', (data) => {
        console.log("Received message:", data); // Добавляем это для отладки
        io.sockets.emit('add mess', {msg: data.mess, name: data.name});
    });
});
