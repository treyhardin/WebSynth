import { createElement, useEffect, useRef, useState } from 'react'
import { getNameFromNoteNumber } from '../../helpers/helpers'
import QWERTYInput from '../input/qwerty-input'
import './virtual-keyboard.css'

export default function VirtualKeyboard(props) {

    let virtualKeyboard = useRef()

    // Create Keys
    let firstKey = 48
    let keyCount = 47

    // console.log(props.inputType)

    if (props.inputType === 'virtualKeyboard' && !props.touchControls) {
        keyCount = 16
    }

    // if (props.inputType === 'midi') {
    //     keyCount = 96
    // }

    let keyboardKeys = []
    let qwertyLabels = ['a', 'w', 's', 'e', 'd', 'f', 't', 'g', 'y', 'h', 'u', 'j', 'k', 'o', 'l', 'p', ';' ]
    let qwertyLabelIndex = 0

    for (let i = firstKey; i <= keyCount + firstKey; i++ ) {
        let keyLabel = qwertyLabels[qwertyLabelIndex]
        qwertyLabelIndex++
        // let keyLabel = 'g'
        let keyColor = 'white'
        let noteName = getNameFromNoteNumber(i)
        let noteNumber = i + (props.octave * 12)
        
        if (noteName == 'C#' || noteName == 'D#' || noteName == 'F#' || noteName == 'G#' || noteName == 'A#') {
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

        if (keyPressed) {
        
            props.keyDownHandler(keyPressed, 127)

            elementPressed.addEventListener('pointerleave', (mouseLeaveEvent) => {
                if (isPlaying) props.keyUpHandler(keyPressed, 127)
                isPlaying = false
            }, {once: true})

            elementPressed.addEventListener('pointerup', () => {
                if (isPlaying) props.keyUpHandler(keyPressed, 127)
                isPlaying = false
            }, {once: true})

        }
    }

    let pointerDown = false

    const virtualKeyboardPointerUpHandler = (e) => {
        pointerDown = false
    }

    useEffect(() => {

        // Add Key Interactions
        let virtualKeys = virtualKeyboard.current.querySelectorAll('.keyboard-note')
        virtualKeys.forEach((virtualKey) => {

            // Add Pointer Events
            virtualKey.addEventListener('pointerdown', virtualKeyDownHandler)
        })

    }, [virtualKeyboard, props.octave])

    return (
        <>
            <section className={`virtual-keyboard ${props.touchControls && props.inputType === 'virtualKeyboard' ? 'touch-enabled' : null}`} ref={virtualKeyboard}>
                {keyboardKeys.map((key) => {
                    return <span key={key.note} data-key-note={key.note} className={`keyboard-note label ${key.color}-key`}><p className='key-label'>{key.label}</p></span>
                })}
            </section>
        </>
    )
}