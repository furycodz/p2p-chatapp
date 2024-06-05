require('dotenv').config();
const express = require("express");
const http = require("http");
const Gun = require('gun');
const path = require('path');
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server,{
    cors: {
        origin: ["http://localhost:3000", "http://172.20.10.3:3000", "http://172.20.10.3"],
    }
});

const users = {};

const socketToRoom = {};
const maxUsers = 10;

const gun = Gun({ web: server });

app.use(express.static(path.join(__dirname, 'public')));

app.get('/gun', (req, res) => {
    res.sendFile(path.join(__dirname, 'node_modules', 'gun', 'gun.js'));
});

io.on('connection', socket => {
    socket.on("join room", (info) => {
        const roomID = info[0]
        const publicKey = info[1]
        // console.log('joined' + publicKey)
        if (users[roomID]) {
            const length = users[roomID].length;
            if (length === maxUsers) {
                socket.emit("room full");
                return;
            }
            users[roomID].push([socket.id, publicKey]);
        } else {
            users[roomID] = [[socket.id, publicKey]];
        }
        socketToRoom[socket.id] = roomID;
        const usersInThisRoom = users[roomID].filter(id => id[0] !== socket.id); 

        socket.emit("all users", usersInThisRoom);
        
    });

    socket.on("sending signal", payload => {
        const publicKey = (users[socketToRoom[payload.callerID]].filter(id => id[0] == payload.callerID)[0][1])
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID, publicKey: publicKey });
    });

    socket.on("returning signal", payload => {
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

    socket.on('disconnect', () => {
        const roomID = socketToRoom[socket.id];
        let room = users[roomID];
        if (room) {
            room = room.filter(id => id !== socket.id);
            users[roomID] = room;
        }
    });


    socket.on('store message', (roomID, message) => {
       
        gun.get('messages').get(roomID).set(message);
       
    });


    socket.on('get messages', (roomID, callback) => {
       
        let messages = [];
        gun.get('messages').get(roomID).map().once((data) => {
            if (data) {
                messages.push(data);
                console.log("data")
            }else{
                console.log("No data")
            }
        }).then(() => {
            callback(messages);
        })   
       

    });




});

server.listen(process.env.PORT || 8000, () => console.log('server is running on port 8000'));


