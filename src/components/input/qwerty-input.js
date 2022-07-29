import { useEffect, useRef } from "react";


export default function QWERTYInput(props) {

    let currentOctave = useRef()
    

    const mapKeys = (e, handler, direction, octave) => {

        // console.log(props.octave)

        switch (e.key) {
            case 'a':
                // console.log(props.octave)
                handler(60)
                // handler(48 + octave * 12, 127)
                break
            case 'w':
                // handler(49 + octave * 12, 127)
                handler(61)
                break
            case 's':
                // handler(50 + octave * 12, 127)
                handler(62)
                break
            case 'e':
                // handler(51 + octave * 12, 127)
                handler(63)
                break
            case 'd':
                // handler(52 + octave * 12, 127)
                handler(64)
                break
            case 'f':
                // handler(53 + octave * 12, 127)
                handler(65)
                break
            case 't':
                // handler(54 + octave * 12, 127)
                handler(66)
                break
            case 'g':
                // handler(55 + octave * 12, 127)
                handler(67)
                break
            case 'y':
                // handler(56 + octave * 12, 127)
                handler(68)
                break
            case 'h':
                // handler(57 + octave * 12, 127)
                handler(69)
                break
            case 'u':
                // handler(58 + octave * 12, 127)
                handler(70)
                break
            case 'j':
                // handler(59 + octave * 12, 127)
                handler(71)
                break
            case 'k':
                // handler(60 + octave * 12, 127)
                handler(72)
                break
            case 'o':
                // handler(61 + octave * 12, 127)
                handler(73)
                break
            case 'l':
                // handler(62 + octave * 12, 127)
                handler(74)
                break
            case 'p':
                // handler(63 + octave * 12, 127)
                handler(75)
                break
            case ';':
                // handler(64 + octave * 12, 127)
                handler(76)
                break
            case 'z':
                if (direction === 'keyDown') {
                    currentOctave.current -= 1
                    props.setOctave(currentOctave.current)
                }
                break
            case 'x':
                if (direction === 'keyDown') {
                    currentOctave.current += 1
                    props.setOctave(currentOctave.current)
                }
                break
            default:
                break
        }

    }

    const handleQWERTYKeyDown = (keyNumber) => {
        let note = keyNumber + currentOctave.current * 12
        props.keyDownHandler(note, 127)
    }

    const handleQWERTYKeyUp = (keyNumber) => {
        let note = keyNumber + currentOctave.current * 12
        props.keyUpHandler(note, 0)
    }

    const registerListeners = (octave) => {

        window.addEventListener('keydown', (e) => {
            if (!e.repeat) {
                mapKeys(e, handleQWERTYKeyDown, 'keyDown')
                e.stopImmediatePropagation()
            }
        })

        window.addEventListener('keyup', (e) => {
            mapKeys(e, handleQWERTYKeyUp, 'keyUp')
            e.stopImmediatePropagation()
        })
    }

    useEffect(() => {

        currentOctave.current = props.octave

        window.removeEventListener('keydown', mapKeys)
        window.removeEventListener('keyup', mapKeys)

        registerListeners(props.octave)

    }, [props.octave])
    
}