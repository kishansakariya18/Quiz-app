import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import CreateProblem from './CreateProblem';
import QuizControls from './QuizControls';


export const Admin = () => {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [socket, setSocket] = useState<null | any>(null);
    const [quizId, setQuizId] = useState("");
    const [roomId, setRoomId] = useState("");

    useEffect(() => {
        const socket = io('http://localhost:3000');
        console.log('socket: ', socket);

        setSocket(socket)

        socket.on("connect", () => {
            console.log(socket.id);
            alert("Connected")
            socket.emit("joinAdmin", {
                password: "ADMIN_PASSWORD"
            })
        })

    }, [])

    if (!quizId) {
        return (
            <div>
                <input type="text" onChange={(e) => {
                    setRoomId(e.target.value)
                }} />

                <button onClick={() => {
                    socket.emit("createQuiz", {
                        roomId
                    });
                    setQuizId(roomId)
                }}>create room</button>
            </div>
        )
    }

    return (
        <div>
            <CreateProblem roomId={quizId} socket={socket} />
            <QuizControls socket={socket} roomId={roomId} />
        </div>
    )

}
