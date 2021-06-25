const express = require('express')

const app = express()
const http = require('http')
const fs = require('fs')
const config = require('./config')
const path = require('path')
const { join } = require('path')

const options = {
    key: fs.readFileSync(path.join(__dirname,config.sslKey), 'utf-8'),
    cert: fs.readFileSync(path.join(__dirname,config.sslCrt), 'utf-8')
}

const httpsServer = http.createServer(app)
const io = require('socket.io')(httpsServer)


app.get("/", (req, res) => {
    res.send("Ok")
})

httpsServer.listen(config.listenPort, () => {
    console.log('listening https ' + config.listenPort)
})

let roomList = new Map()
let activities = new Map();


io.on('connection', socket => {

    socket.on('createRoom', async ({
        room_id
    }, callback) => {
        if (roomList.has(room_id)) {
            callback('already exists')
        } else {
            console.log('---created room--- ', room_id)
            let worker = await getMediasoupWorker()
            roomList.set(room_id, new Room(room_id, worker, io, socket.id))
            callback(room_id)
        }
    })

    socket.on('create', (room) => {
        console.log("CREATE", room)
        socket.join(room);
        io.to(socket.id).emit(room, room);

        io.to(socket.id).emit('activities', activities.get(room) ? activities.get(room) : 'text');
    });

      /**
     * type data:
     * room: string
     * value : string
     */
       socket.on('activities', (data) => {
        console.log("ACTTT")

        activities.set(data.room, data.value)
        io.in(data.room).emit("activities", data.value);
    });


})