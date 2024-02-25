

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const QuizControls = ({socket, roomId} : { socket: any , roomId: string}) => {
  return (
    <div>QuizControls
        <button onClick={() => {
            socket.emit("next", {
                roomId
            })
        }}>Next Problem</button>
    </div>
  )
}

export default QuizControls