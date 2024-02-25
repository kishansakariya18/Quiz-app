//* submit , get current state
import { IoManager } from "./IoManager";

interface User {
  name: string;
  id: string;
  points: number;
}

export type AllowedSubmissions = 0 | 1 | 2 | 3;

const PROBLEM_TIME_S = 20;

interface Submission {
  problemId: string;
  userId: string;
  isCorrect: boolean;
  optionSelected: AllowedSubmissions
}
interface Problem {
  id: string;
  title: string;
  description: string;
  image?: string;
  startTime: number;
  answer: AllowedSubmissions;
  options: {
    id: number;
    title: string;
  }[];
  submissions: Submission[];
}
//

export class Quiz {
  public roomId: string;
  private hasStarted: boolean;
  private problems: Problem[];
  private activeProblem: number;
  private users: User[];
  private currentState: "leaderboard" | "question" | "not_started" | "ended";

  constructor(roomId: string) {
    this.roomId = roomId,
    this.hasStarted = false
    this.problems = [];
    this.activeProblem = 0;
    this.users = [];
    this.currentState = "not_started"
    console.log("room Created")
    setInterval(() => {
      this.debug()
    }, 10000)
  }

  debug(){
    console.log("----- debug -------");
    console.log(this.roomId);
    console.log('problem' + JSON.stringify(this.problems));
    console.log(this.users);
    console.log(this.currentState)
    console.log(this.activeProblem)
  }

  addProblem(problem: Problem) {
    this.problems.push(problem);
    console.log('problem Arr: ',this.problems)
  }

  start() {
    this.hasStarted = true;
    this.setActiveProblem(this.problems[0]);
  }

  setActiveProblem(problem: Problem) {

    console.log('set active problem');
    
    this.currentState = "question"
    problem.startTime = new Date().getTime();
    problem.submissions = [];
    IoManager.getIo().to(this.roomId).emit("problem", {
      problem,
    });
    //Todo : clear this if function moves ahead
    setTimeout(() => {
      this.sendLeaderboard();
    }, PROBLEM_TIME_S * 1000);
  }

  sendLeaderboard() {
    this.currentState = "leaderboard"
    const leaderboard = this.getLeaderboard()
    IoManager.getIo().to(this.roomId).emit("leaderboard", {
      leaderboard,
    });
  }

  next() {
    this.activeProblem++;
    const problem = this.problems[this.activeProblem];

    console.log('problem:: ', problem);
    
    if (problem) {
      console.log('problem found')
      this.setActiveProblem(problem);
    } else {
        this.activeProblem --;
      };
  }

  genRandonString(length: number) {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()";
    var charLength = chars.length;
    var result = "";
    for (var i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * charLength));
    }
    return result;
  }

  addUser(name: string) {
    const id = this.genRandonString(7);
    this.users.push({
      name,
      id,
      points: 0
    });

    return id;
  }

  submit(
    userId: string,
    roomId: string,
    problemId: string,
    submission: 0 | 1 | 2 | 3
  ) {
    const problem = this.problems.find((x) => x.id == problemId);
    const user = this.users.find((x) => x.id == userId);

    if (!problem || !user) {
      return;
    }

    if (problem) {
      const existingSubmission = problem.submissions.find(
        (x) => x.userId == userId
      );

      if (existingSubmission) {
        return;
      }

      problem.submissions.push({
        problemId,
        userId,
        isCorrect: problem.answer === submission,
        optionSelected: submission,
      });
    }

    user.points +=
      1000 - (500 * (new Date().getTime() - problem.startTime)) / 20;
  }

  getLeaderboard() {
    return this.users.sort((a, b) => (a.points < b.points ? 1 : -1)).splice(0, 20);
  }
  getCurrentState(){
    if(this.currentState === "not_started"){
        return { 
            type: "not_started"
        }
    }

    if(this.currentState === "ended"){
        return {
            type: "ended",
            leaderboad: this.getLeaderboard()
        }
    }
    if(this.currentState === "leaderboard"){
        return {
            type: "leaderboard",
            leaderboad: this.getLeaderboard()
        }
    }
    if(this.currentState === "question"){

        const problem = this.problems[this.activeProblem];

        return {
            type: "question",
            problem: problem
        }
    }
  }
}
