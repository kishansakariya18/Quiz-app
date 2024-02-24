import http from 'http'
import { Server } from "socket.io";
import { IoManager } from './managers/IoManager';
import { UserManager } from './managers/UserManager';
const server =  http.createServer()


const io = IoManager.getIo()
io.listen(3000)
const userManager = new UserManager()
io.on('connection', (socket) => {  
  userManager.addUser(socket)
})
