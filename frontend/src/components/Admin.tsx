import { useEffect } from 'react';
import  { io } from 'socket.io-client';


const URL = 'http://localhost:4000';





export const Admin = () => {
    useEffect(() => {
         const socket = io(URL);

         socket.on("connect" , () => {
            console.log(socket.id);
            socket.emit("joinAdmin",  {
                password: "ADMIN_PASSWORD"
            })

            socket.on("adminInit", {})
         })

    })
  return (
    <div>

    </div>
  )
}
