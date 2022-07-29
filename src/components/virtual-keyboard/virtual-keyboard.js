import { useEffect, useRef } from 'react'
import { getNameFromNoteNumber } from '../../helpers/helpers'
import './virtual-keyboard.css'

export default function VirtualKeyboard(props) {

    let virtualKeyboard = useRef()

    // Create Keys
    let firstKey = 24
    let keyCount = 72

    if (props.inputType === 'virtualKeyboard' && !props.touchControls) {

        firstKey = 60 // If you change this, make sure to update the mapping in qwerty-input.js
        keyCount = 16
    }

    let keyboardKeys = []
    let qwertyLabels = ['a', 'w', 's', 'e', 'd', 'f', 't', 'g', 'y', 'h', 'u', 'j', 'k', 'o', 'l', 'p', ';' ]
    let qwertyLabelIndex = 0

    for (let i = firstKey; i <= keyCount + firstKey; i++ ) {
        let keyLabel = qwertyLabels[qwertyLabelIndex]
        qwertyLabelIndex++
        let keyColor = 'white'
        let noteName = getNameFromNoteNumber(i)
        let noteNumber = i + (props.octave * 12)
        
        if (noteName === 'C#' || noteName === 'D#' || noteName === 'F#' || noteName === 'G#' || noteName === 'A#') {
            keyColor = 'black'
        }

        keyboardKeys.push({
            note: noteNumber,
            name: noteName,
            color: keyColor,
            label: keyLabel
        })
    }

    const virtualKeyDownHandler = (e) => {
        let isPlaying = true
        let elementPressed = e.target
        let keyPressed = e.target.dataset.keyNote

        elementPressed.classList.add('pressed')

        if (keyPressed) {
        
            props.keyDownHandler(keyPressed, 127)

            elementPressed.addEventListener('pointerleave', (mouseLeaveEvent) => {
                if (isPlaying) props.keyUpHandler(keyPressed, 127)
                isPlaying = false
                elementPressed.classList.remove('pressed')
            }, {once: true})

            elementPressed.addEventListener('pointerup', () => {
                if (isPlaying) props.keyUpHandler(keyPressed, 127)
                isPlaying = false
                elementPressed.classList.remove('pressed')
            }, {once: true})

        }

        getKeyNumbersPressed(props.activeNotes)
    }

    useEffect(() => {

        // Add Key Interactions
        let virtualKeys = virtualKeyboard.current.querySelectorAll('.keyboard-note')
        virtualKeys.forEach((virtualKey) => {

            // Add Pointer Events
            virtualKey.addEventListener('pointerdown', virtualKeyDownHandler)
        })

    }, [virtualKeyboard, props.octave])


    let keyNumbersPressed = []

    const getKeyNumbersPressed = (notes) => {
        
        let keysPressed = Object.values(notes)
        let newKeysPressed = []
        console.log(keysPressed)
        if (keysPressed.length > 0) {
            keysPressed.map((value) => {
                newKeysPressed.push(value.note)
            })
            return keyNumbersPressed = newKeysPressed
        }
        return keyNumbersPressed = []
    }

    getKeyNumbersPressed(props.activeNotes)

    return (
        <>
            <section className={`virtual-keyboard ${props.touchControls && props.inputType === 'virtualKeyboard' ? 'touch-enabled' : ''} ${props.inputType === 'midi' ? 'midi-keyboard' : ''}`} ref={virtualKeyboard}>
                {keyboardKeys.map((key) => {
                    return (
                    <span 
                        key={key.note} 
                        data-key-note={key.note} 
                        className={`keyboard-note label ${key.color}-key ${keyNumbersPressed.includes(key.note) ? 'pressed' : ''}`}
                    >
                        <p className='key-label'>{key.label}</p>
                    </span>
                    )
                })}
            </section>
        </>
    )
}