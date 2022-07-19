import { useEffect, useRef } from "react";

export default function Input(props) {

    // Is Input Enabled
    let inputActive = useRef();
    inputActive.current = props.synthActive

    useEffect(() => {
        // Check Browser Support
        if (navigator.requestMIDIAccess && "requestMIDIAccess" in navigator) {
            navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure)
        } else {
            console.log("Browser does not support MIDI access")
        }
    }, [])

    // Handle MIDI Success
    const onMIDISuccess = (midiAccess) => {

        // Detect Device Change
        midiAccess.addEventListener('stateChange', updateDevices)

        // Get Compatible Inputs
        const inputs = midiAccess.inputs;

        // Assign Device
        inputs.forEach((input) => {
            if (input.manufacturer !== '') {
                input.addEventListener('midimessage', getMIDIMessage)
            }
        })
    }

    // Handle Device List Update
    const updateDevices = (devices) => {
        console.log("Device Change")
    }

    // Handle MIDI Failure
    const onMIDIFailure = () => {
        console.log('Could not access your MIDI devices.');
    }

    // MIDI Input Listener
    const getMIDIMessage = (midiMessage) => {

        // Map Inputs for Active Device
        if (midiMessage.target === midiMessage.currentTarget && inputActive.current) {

            // console.log(midiMessage)
            switch (midiMessage.data[0]) {
                case 144:
                    keyDown(midiMessage)
                    break
                case 128:
                    keyUp(midiMessage)
                    break
                case 176:
                    rangeInput(midiMessage)
                    break
                case 153:
                    padDown(midiMessage)
                    break
                case 137:
                    padUp(midiMessage)
                    break
                case 169:
                    aftertouch(midiMessage)
                    break
                case 224:
                    pitchBend(midiMessage)
                    break
                default:
                    break
            }

        }

    }

    


    // Add Computer Keyboard Support
    let octave = 0;

    window.addEventListener('keydown', (e) => {
        // console.log("KEYDOWN LISTENER")
        if (inputActive.current && !e.repeat) {
            switch (e.key) {
                case 'a':
                    props.virtualKeyDown(e, {data: [144, 48 + octave * 12, 0]})
                    break
                case 'w':
                    props.virtualKeyDown(e, {data: [144, 49 + octave * 12, 0]})
                    break
                case 's':
                    props.virtualKeyDown(e, {data: [144, 50 + octave * 12, 0]})
                    break
                case 'e':
                    props.virtualKeyDown(e, {data: [144, 51 + octave * 12, 0]})
                    break
                case 'd':
                    props.virtualKeyDown(e, {data: [144, 52 + octave * 12, 0]})
                    break
                case 'f':
                    props.virtualKeyDown(e, {data: [144, 53 + octave * 12, 0]})
                    break
                case 't':
                    props.virtualKeyDown(e, {data: [144, 54 + octave * 12, 0]})
                    break
                case 'g':
                    props.virtualKeyDown(e, {data: [144, 55 + octave * 12, 0]})
                    break
                case 'y':
                    props.virtualKeyDown(e, {data: [144, 56 + octave * 12, 0]})
                    break
                case 'h':
                    props.virtualKeyDown(e, {data: [144, 57 + octave * 12, 0]})
                    break
                case 'u':
                    props.virtualKeyDown(e, {data: [144, 58 + octave * 12, 0]})
                    break
                case 'j':
                    props.virtualKeyDown(e, {data: [144, 59 + octave * 12, 0]})
                    break
                case 'k':
                    props.virtualKeyDown(e, {data: [144, 60 + octave * 12, 0]})
                    break
                case 'o':
                    props.virtualKeyDown(e, {data: [144, 61 + octave * 12, 0]})
                    break
                case 'l':
                    props.virtualKeyDown(e, {data: [144, 62 + octave * 12, 0]})
                    break
                case 'p':
                    props.virtualKeyDown(e, {data: [144, 63 + octave * 12, 0]})
                    break
                case ';':
                    props.virtualKeyDown(e, {data: [144, 64 + octave * 12, 0]})
                    break
                default:
                    break
            }
        }
        e.stopImmediatePropagation()
    })

    window.addEventListener('keyup', (e) => {
        // console.log("KEYUP LISTENER")
        if (inputActive.current) {
            switch (e.key) {
                case 'a':
                    props.virtualKeyUp(e, {data: [144, 48 + octave * 12, 0]})
                    break
                case 'w':
                    props.virtualKeyUp(e, {data: [144, 49 + octave * 12, 0]})
                    break
                case 's':
                    props.virtualKeyUp(e, {data: [144, 50 + octave * 12, 0]})
                    break
                case 'e':
                    props.virtualKeyUp(e, {data: [144, 51 + octave * 12, 0]})
                    break
                case 'd':
                    props.virtualKeyUp(e, {data: [144, 52 + octave * 12, 0]})
                    break
                case 'f':
                    props.virtualKeyUp(e, {data: [144, 53 + octave * 12, 0]})
                    break
                case 't':
                    props.virtualKeyUp(e, {data: [144, 54 + octave * 12, 0]})
                    break
                case 'g':
                    props.virtualKeyUp(e, {data: [144, 55 + octave * 12, 0]})
                    break
                case 'y':
                    props.virtualKeyUp(e, {data: [144, 56 + octave * 12, 0]})
                    break
                case 'h':
                    props.virtualKeyUp(e, {data: [144, 57 + octave * 12, 0]})
                    break
                case 'u':
                    props.virtualKeyUp(e, {data: [144, 58 + octave * 12, 0]})
                    break
                case 'j':
                    props.virtualKeyUp(e, {data: [144, 59 + octave * 12, 0]})
                    break
                case 'k':
                    props.virtualKeyUp(e, {data: [144, 60 + octave * 12, 0]})
                    break
                case 'o':
                    props.virtualKeyUp(e, {data: [144, 61 + octave * 12, 0]})
                    break
                case 'l':
                    props.virtualKeyUp(e, {data: [144, 62 + octave * 12, 0]})
                    break
                case 'p':
                    props.virtualKeyUp(e, {data: [144, 63 + octave * 12, 0]})
                    break
                case ';':
                    props.virtualKeyUp(e, {data: [144, 64 + octave * 12, 0]})
                    break
                default:
                    break
                
            }
        }
        e.stopImmediatePropagation()
    })


    const keyDown = (midiMessage) => {
        props.keyDown(midiMessage)
    }

    const rangeInput = (midiMessage) => {
        props.range(midiMessage)
    }

    const keyUp = (midiMessage) => {
        props.keyUp(midiMessage)
    }

    const padDown = (midiMessage) => {
        props.padDown(midiMessage)
    }

    const padUp = (midiMessage) => {
        props.padUp(midiMessage)
    }

    const aftertouch = (midiMessage) => {
        props.aftertouch(midiMessage)
    }

    const pitchBend = (midiMessage) => {
        props.pitchBend(midiMessage)
    }

}
