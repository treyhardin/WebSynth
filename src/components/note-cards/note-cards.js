import { useEffect } from "react"
import { useMIDIInputContext } from "../../contexts/MIDIInputContext"


export default function NoteCards(props) {

    const { MIDIData, setMIDIData } = useMIDIInputContext()

    // console.log("HI")

    // console.log("Rerender")
    
    useEffect(() => {
        console.log(MIDIData)
    }, [props])

    let notes = []
    // let pressedNotes = []

    // useEffect(() => {
    //     console.log(props)
    // }, [props])

    // if (props.notes) {
    //     console.log("GOT PROPS")

    //     let noteProps = Object.entries(props.notes)
    //     for (const note of noteProps) {
    //         const {channel, type, command, noteNumber, noteName, octave, value} = note
    //         notes.push({
    //             channel,
    //             type,
    //             command, 
    //             noteNumber, 
    //             noteName, 
    //             octave, 
    //             value
    //         })
    //         console.log(notes)
    //     }
    // }

    // console.log("Rerender")

    // useEffect(() => {
        
    //     console.log("Rerender")

    //     // console.log(props)
    //     if (props.notes) {

    //         notes = Object.entries(props.notes)
            
    //         for (const note of notes) {
    //             notes.push(<div>{props.notes.noteNumber}</div>)
    //             // console.log(`Note: ${note}`)
    //         }
    //     }
        
    // }, [props])

    return (
        // <div className="note-card-wrapper">
        //     {pressedNotes.map((note) => {
        //         <div className="note-card">Test</div>
        //     })}
        // </div>
        <></>
    )
    
}