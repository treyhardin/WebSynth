import { createElement, useEffect, useRef, useState } from 'react'
import { getNameFromNoteNumber } from '../../helpers/helpers'
import './virtual-keyboard.css'

export default function VirtualKeyboard(props) {

    let virtualKeyboard = useRef()

    // Create Keys
    let firstKey = 48
    let keyCount = 47

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
        let elementPressed = e.target
        let keyPressed = e.target.dataset.keyNote

        if (keyPressed) {
        
            props.keyDownHandler(keyPressed, 127)

            elementPressed.addEventListener('pointerleave', (mouseLeaveEvent) => {
                // console.log(mouseLeaveEvent)
                if (isPlaying) props.keyUpHandler(keyPressed, 127)
                // console.log(mouseLeaveEvent)
                isPlaying = false
            }, {once: true})

            elementPressed.addEventListener('pointerup', () => {
                if (isPlaying) props.keyUpHandler(keyPressed, 127)
                isPlaying = false
            }, {once: true})

        }
    }

    let pointerDown = false

    

    // const virtualKeyLeaveHandler = (e) => {

    // }

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

    

    // const virtualKeyboardPointerDownHandler = (e) => {
    //     pointerDown = true

    //     // console.log('click')
    //     // console.log(e)
    // }

    const virtualKeyboardPointerUpHandler = (e) => {
        pointerDown = false
    }

    const virtualKeyEnterHandler = (e) => {
        // console.log(pointerDown)
        if (pointerDown) {
            console.log('move worked')
        }
    }

    useEffect(() => {

        // virtualKeyboard.current.addEventListener('pointerdown', virtualKeyboardPointerDownHandler)
        // virtualKeyboard.current.addEventListener('pointerdown', virtualKeyboardPointerUpHandler)

        // Add Key Interactions
        let virtualKeys = virtualKeyboard.current.querySelectorAll('.keyboard-note')
        virtualKeys.forEach((virtualKey) => {

            // Add Touch Events
            // if (props.touchControls) {
            //     virtualKey.addEventListener('touchstart', virtualKeyDownHandler(virtualKey))
            //     // virtualKey.addEventListener('touchend', virtualKeyUpHandler(virtualKey))
            //     return
            // }

            // Add Mouse Events
            // virtualKey.addEventListener('pointerenter', virtualKeyEnterHandler)
            // virtualKeyboard.current.addEventListener('pointerdown', virtualKeyboardPointerHandler)
            virtualKey.addEventListener('pointerdown', virtualKeyDownHandler)
            // virtualKey.addEventListener('mouseup', virtualKeyUpHandler)
            // virtualKey.addEventListener('dragenter', dragEnterHandler)
            // virtualKey.addEventListener('dragleave', dragLeaveHandler)
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