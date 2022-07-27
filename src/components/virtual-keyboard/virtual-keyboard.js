import { createElement, useEffect, useRef, useState } from 'react'
import { getNameFromNoteNumber } from '../../helpers/helpers'
import './virtual-keyboard.css'

export default function VirtualKeyboard(props) {

    let virtualKeyboard = useRef()

    // Create Keys
    let firstKey = 48
    let keyCount = 32

    let keyboardKeys = []

    for (let i = firstKey; i <= keyCount + firstKey; i++ ) {
        let keyColor = 'white'
        let noteName = getNameFromNoteNumber(i)
        
        if (noteName == 'C#' || noteName == 'D#' || noteName == 'F#' || noteName == 'G#' || noteName == 'A#') {
            keyColor = 'black'
        }

        keyboardKeys.push({
            note: i,
            name: noteName,
            color: keyColor
        })
    }

    const virtualKeyDownHandler = (e) => {
        let isPlaying = true
        console.log('mousedown')
        let elementPressed = e.target
        let keyPressed = e.target.dataset.keyNote
        // console.log(props)
        props.keyDownHandler(keyPressed, 127)

        elementPressed.addEventListener('mouseleave', (mouseLeaveEvent) => {
            if (isPlaying) props.keyUpHandler(keyPressed, 127)
            isPlaying = false
        }, {once: true})

        elementPressed.addEventListener('mouseup', () => {
            // console.log('mouseup')
            if (isPlaying) props.keyUpHandler(keyPressed, 127)
            isPlaying = false
        }, {once: true})
    }

    // const virtualKeyUpHandler = (e, virtualKey) => {
    //     console.log(virtualKey)
    //     // console.log(e.target)
    //     // console.log(e.srcElement)
    //     // console.log(e.target === e.srcElement)
    //     // if (e.target === e.srcElement) {
    //         let keyPressed = e.target.dataset.keyNote
    //         props.keyUpHandler(keyPressed, 127)
    //         console.log(e)
    //     // }
        
    // }

    const dragEnterHandler = (e) => {
        console.log(e)
    }

    const dragLeaveHandler = (e) => {
        // console.log(e)
    }

    useEffect(() => {

        // Add Key Interactions
        let virtualKeys = virtualKeyboard.current.querySelectorAll('.keyboard-note')
        virtualKeys.forEach((virtualKey) => {

            // Add Touch Events
            if (props.touchControls) {
                virtualKey.addEventListener('touchstart', virtualKeyDownHandler(virtualKey))
                // virtualKey.addEventListener('touchend', virtualKeyUpHandler(virtualKey))
                return
            }

            // Add Mouse Events
            virtualKey.addEventListener('mousedown', virtualKeyDownHandler)
            // virtualKey.addEventListener('mouseup', virtualKeyUpHandler)
            virtualKey.addEventListener('dragenter', dragEnterHandler)
            virtualKey.addEventListener('dragleave', dragLeaveHandler)
        })

    }, [virtualKeyboard])

    return (
        <section className={`virtual-keyboard ${props.touchControls ? 'touch-enabled' : null}`} ref={virtualKeyboard}>
            {keyboardKeys.map((key) => {
                return <span key={key.note} data-key-note={key.note} className={`keyboard-note label ${key.color}-key`}><p className='key-label'>{key.name}</p></span>
            })}
        </section>
    )
}