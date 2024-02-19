import http from 'http'
import { Server } from "socket.io";
import { IoManager } from './managers/IoManager';
const server =  http.createServer()


const io = IoManager.getIo()

io.on("connection" , (client) => {
  client.on('event' , (data) => {
      //3 Admin events
      //2 users events
      // user manager => Quiz Manager => Quiz => broadcast
  })
} )
server.listen(3000 , () => "Server Listen on 3000");