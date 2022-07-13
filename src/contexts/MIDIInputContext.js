import { createContext, useContext, useState } from "react";

const MIDIInputContext = createContext()
const MIDIInputUpdateContext = createContext()

export const useMIDIInputContext = () => {
    const { MIDIData, setMIDIData } = useContext(MIDIInputContext)
    return { MIDIData, setMIDIData }
}

// export const useMIDIInputUpdateContext = () => {
//     return useContext(MIDIInputUpdateContext)
// }

export const MIDIInputProvider = ({children}) => {

    const [MIDIData, setMIDIData] = useState(null)

    // const handleInput = (input) => {
    //     setMIDIData(input = input)
    // }

    return (
        <MIDIInputContext.Provider value={{MIDIData, setMIDIData}}>
            {/* <MIDIInputUpdateContext.Provider value={handleInput}> */}
                {children}
            {/* </MIDIInputUpdateContext.Provider> */}
        </MIDIInputContext.Provider>
    )

}