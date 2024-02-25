import { useEffect, useState } from "react"
import { io } from 'socket.io-client';
import CurrentQuestion from "./CurrentQuestion";
import Leaderboard from "./Leaderboard";


export const User = () => {

  console.log('user called ');



  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false)

  if (!submitted) {
    return <div >
      Name - <input type="text" placeholder="name" onChange={(e) => {
        setName(e.target.value);
      }} />

      <button onClick={() => {
        setSubmitted(true);
      }}>Submit</button>
    </div>
  }

  return <UserLoggedIn name={name} />


}

export const UserLoggedIn = ({ name }: { name: string }) => {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [socket, setSocket] = useState<null | any>(null);
  const [currentState, setCurrentState] = useState("not_started");
  const searchParams = new URLSearchParams(document.location.search);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);
  const [userId, setUserId] = useState(localStorage.getItem(""));

  const roomId = searchParams.get("roomId");

  useEffect(() => {
    const socket = io('http://localhost:3000');
    setSocket(socket)
    socket.on("connect", () => {
      console.log(socket.id);
      socket.emit("join", {
        roomId,
        name
      })
    })

    socket.on("init", ({ userId, state }) => {

      setUserId(userId)
      console.log('state:' + state);
      if (state.leaderboard) {
        setLeaderboard(state.leaderboard);
      }
      if (state.question) {
        setCurrentQuestion(state.problem)
      }
      setCurrentState(state.type);

    });

    socket.on("leaderboard", (data) => {
      console.log("leaderboard recevied");
      setCurrentState("leaderboard");
      setLeaderboard(data.leaderboard);
    });

    socket.on("problem", (data) => {
      setCurrentState("question");
      setCurrentQuestion(data.problem);
    })
  }, []);


  if (currentState === "not_started") {
    return <div>
      This Quiz hasn't started yet
    </div>
  }

  if (currentState === "question") {
    return <CurrentQuestion question={currentQuestion} />
  }
  if (currentState === "leaderboard") {
    console.log("leaderboard called ")
    return <Leaderboard leaderboard={leaderboard} />
  }

  return (
    <div>
      Quiz has {currentState}
    </div>
  )
}
