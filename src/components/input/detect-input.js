import { useEffect } from "react"

export default function DetectInput(props) {

    useEffect(() => {

        // Detect Touch Devices
        if (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)) {
            props.setInputType('virtualKeyboard')
            props.setTouchControls(true)

            /**
             * Update CSS vh unit to match *actual* viewport height even in Safari. See
             * https://css-tricks.com/the-trick-to-viewport-units-on-mobile/ for more info.
             */
            const setVh = () => {
                const vh = window.innerHeight * 0.01
                document.documentElement.style.setProperty("--vh", `${vh}px`)
            }

            setVh()

            window.addEventListener('resize', () => {
                setVh()
            })

            return
        }
        
        // Detect Browser Support for MIDI API
        if (navigator.requestMIDIAccess && "requestMIDIAccess" in navigator) {
            props.setTouchControls(false)
            return props.setInputType('midi')
            // navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure)
        } 

        // Default to QWERTY Input
        props.setInputType('virtualKeyboard')
        props.setTouchControls(false)
        console.log('Your Browser Does Not Support  MIDI. Switching to Computer Keyboard')
        return 

    }, [])
        
}