import http from 'http'
import { Server } from "socket.io";
import { IoManager } from './managers/IoManager';
const server =  http.createServer()


const io = IoManager.getIo()
server.listen(3000);