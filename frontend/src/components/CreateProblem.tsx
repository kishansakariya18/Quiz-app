import  { useState } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CreateProblem = ({ socket, roomId,  }: { socket: any; roomId: string }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("")
    const [answer, setAnswer] = useState(0)
    const [options, setOptions] = useState([{
        id: 0,
        title: ""
    }, {
        id: 1,
        title: ""
    }, {
        id: 2,
        title: ""
    }, {
        id: 3,
        title: ""
    }
    ]);


    return (
        <div>CreateProblem
            Title - <input type="text" onChange={(e) => {
                setTitle(e.target.value)
            }} />
            <br /><br />


            Description: <input type="text" onChange={(e) => {
                setDescription(e.target.value)
            }} />
            <br />
            {[0, 1, 2, 3].map((optionId) => <div>
                <input type="radio" checked={optionId === answer} onChange={() => {
                    setAnswer(optionId)
                }} />
                option {optionId}
                <input type="text" onChange={(e) => {
                    setOptions(options => options.map(x => {

                        if (x.id === optionId) {
                            return {
                                ...x,
                                title: e.target.value
                            }
                        }

                        return x
                    }))
                }} />
                <br />
            </div>

            )}

            <button onClick={() => {
                socket.emit("createProblem", {
                    roomId,
                    problem: {
                        title,
                        description,
                        options,
                        answer
                    }
                })
            }}>Add Problem</button>
        </div>
    )
}

export default CreateProblem