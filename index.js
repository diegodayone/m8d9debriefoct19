const express = require("express")
const socketio = require("socket.io")
const cors = require("cors")
const http = require("http")

const app = express()
app.use(cors())
const socketServer = http.createServer(app).listen(process.env.PORT || 8080)
const io = socketio(socketServer)
io.set('transports', ["websocket"])
io.on("connection", async socket => {
    //console.log(socket.id)

    socket.on("broadcast", (message) => {
        console.log(message)
        socket.broadcast.emit("broadcast", message)
        socket.emit("broadcast", message)
    })

    socket.on("login", username => {
        socket.user = username
    })

    socket.on("private", message => {
        //search for the socket with the ID that we are interested in
        const connectedClientsIds = Object.keys(io.sockets.connected)
        for(let i = 0; i < connectedClientsIds.length; i++){
            const currentSocket = io.sockets.connected[connectedClientsIds[i]];
            if (currentSocket.user === message.to){
                currentSocket.emit("private", message) //deliver the message
            }
        }
        socket.emit("private", message) //auto send message
    })
})

