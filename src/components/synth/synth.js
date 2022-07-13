import { useMIDIInputContext } from "../../contexts/MIDIInputContext"
import { useFullscreenContext } from '../../contexts/FullscreenContext'
import { useCallback, useEffect } from "react"

window.AudioContext = window.AudioContext || window.webkitAudioContext
let audioContext;

const oscillators = {};

export default function Synth() {

    const { MIDIData, setMIDIData } = useMIDIInputContext()

    const isFullscreen = useFullscreenContext()

    

    const midiToFrequency = (number) => {
        const a = 440;
        return (a / 32) * (2 ** ((number - 9) / 12))
    }

    const noteOn = (noteData) => {
        let oscillator = audioContext.createOscillator();
        let noteString = noteData.noteNumber.toString()
        oscillators[noteString] = oscillator
        // console.log(oscillators)
        let oscillatorGain = audioContext.createGain();
        oscillatorGain.gain.value = 0.01;

        oscillator.type = 'square';

        oscillator.frequency.value = midiToFrequency(noteData.noteNumber)

        oscillator.connect(oscillatorGain)
        oscillatorGain.connect(audioContext.destination)
        oscillator.start()
    }

    const noteOff = (noteData) => {

        // console.log("OFF")
        let noteString = noteData.noteNumber.toString()
        const currentOscillator = oscillators[noteString]
        // console.log(currentOscillator)
        // console.log(oscillators)
        // console.log(oscillators[noteData.noteNumber.toString()])
        // console.log(noteData.noteNumber.toString())
        if (currentOscillator) {
            currentOscillator.stop()
        } 
        // delete oscillators[noteData.noteNumber.toString()]
    }


    useEffect(() => {

        // console.log(MIDIData)

        if (isFullscreen && !audioContext) {
            audioContext = new AudioContext();
        }

        if (MIDIData && MIDIData.command == "NoteOn" && isFullscreen) {
            noteOn(MIDIData)
        } else if (MIDIData && MIDIData.command == "NoteOff" && isFullscreen) {
            noteOff(MIDIData)
        }


    }, [isFullscreen, MIDIData])

    

}