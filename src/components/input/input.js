import { useEffect } from "react";

export default function Input(props) {
    

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
        if (midiMessage.target === midiMessage.currentTarget) {
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

    useEffect(() => {
        // Check Browser Support
        if (navigator.requestMIDIAccess && "requestMIDIAccess" in navigator) {
            navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure)
        } else {
            console.log("Browser does not support MIDI access")
        }
    }, [])


    // Add Computer Keyboard Support
    let octave = 0;

    window.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'a':
                // if (e.repeat) { return }
                // console.log(e)
                keyDown({data: [144, 48 + octave * 12, 127]})
                break
            case 'w':
                keyDown({data: [144, 49 + octave * 12, 127]})
                break
            case 's':
                keyDown({data: [144, 50 + octave * 12, 127]})
                break
            case 'w':
                keyDown({data: [144, 51 + octave * 12, 127]})
                break
            case 'a':
                keyDown({data: [144, 52 + octave * 12, 127]})
                break
            case 'w':
                keyDown({data: [144, 53 + octave * 12, 127]})
                break
            case 'a':
                keyDown({data: [144, 54 + octave * 12, 127]})
                break
            case 'w':
                keyDown({data: [144, 55 + octave * 12, 127]})
                break
            case 's':
                keyDown({data: [144, 50 + octave * 12, 127]})
                break
            case 'e':
                keyDown({data: [144, 51 + octave * 12, 127]})
                break
            case 'd':
                keyDown({data: [144, 52 + octave * 12, 127]})
                break
            case 'f':
                keyDown({data: [144, 53 + octave * 12, 127]})
                break
            case 't':
                keyDown({data: [144, 54 + octave * 12, 127]})
                break
            case 'g':
                keyDown({data: [144, 55 + octave * 12, 127]})
                break
            case 'y':
                keyDown({data: [144, 56 + octave * 12, 127]})
                break
            case 'h':
                keyDown({data: [144, 57 + octave * 12, 127]})
                break
            case 'u':
                keyDown({data: [144, 58 + octave * 12, 127]})
                break
            case 'j':
                keyDown({data: [144, 59 + octave * 12, 127]})
                break
            case 'k':
                keyDown({data: [144, 60 + octave * 12, 127]})
                break
            case 'o':
                keyDown({data: [144, 61 + octave * 12, 127]})
                break
            case 'l':
                keyDown({data: [144, 62 + octave * 12, 127]})
                break
            case 'p':
                keyDown({data: [144, 63 + octave * 12, 127]})
                break
            case ';':
                keyDown({data: [144, 64 + octave * 12, 127]})
                break
            case 'z':
                octave -= 1
                console.log(octave)
                break
            case 'x':
                octave += 1
                console.log(octave)
                break
        }
    })

    window.addEventListener('keyup', (e) => {

        switch (e.key) {
            case 'a':
                keyUp({data: [144, 48 + octave * 12, 0]})
                break
            case 'w':
                keyUp({data: [144, 49 + octave * 12, 0]})
                break
            case 's':
                keyUp({data: [144, 50 + octave * 12, 0]})
                break
            case 'e':
                keyUp({data: [144, 51 + octave * 12, 0]})
                break
            case 'd':
                keyUp({data: [144, 52 + octave * 12, 0]})
                break
            case 'f':
                keyUp({data: [144, 53 + octave * 12, 0]})
                break
            case 't':
                keyUp({data: [144, 54 + octave * 12, 0]})
                break
            case 'g':
                keyUp({data: [144, 55 + octave * 12, 0]})
                break
            case 'y':
                keyUp({data: [144, 56 + octave * 12, 0]})
                break
            case 'h':
                keyUp({data: [144, 57 + octave * 12, 0]})
                break
            case 'u':
                keyUp({data: [144, 58 + octave * 12, 0]})
                break
            case 'j':
                keyUp({data: [144, 59 + octave * 12, 0]})
                break
            case 'k':
                keyUp({data: [144, 60 + octave * 12, 0]})
                break
            case 'o':
                keyUp({data: [144, 61 + octave * 12, 0]})
                break
            case 'l':
                keyUp({data: [144, 62 + octave * 12, 0]})
                break
            case 'p':
                keyUp({data: [144, 63 + octave * 12, 0]})
                break
            case ';':
                keyUp({data: [144, 64 + octave * 12, 0]})
                break
            
        }
        
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
