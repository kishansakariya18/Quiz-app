// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Leaderboard = ({ leaderboard }: { leaderboard: any }) => {

  console.log("leaderboard component called", leaderboard)
  return (
    <div>{JSON.stringify(leaderboard)}</div>
  )
}

export default Leaderboard