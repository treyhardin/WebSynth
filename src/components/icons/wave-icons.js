export default function WaveIcons(props) {
    switch (props.waveType){
        case 'Sawtooth':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 34 26">
                    <path stroke="currentColor" d="M32.76 25.077V1.531l-32 23.546"/>
                </svg>
            )
            // break
        case 'Sine':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 33 26">
                    <path stroke="currentColor" d="M.76 24.726c11.117 0 4.883-23.545 16-23.545s4.883 23.545 16 23.545"/>
                </svg>
            )
            // break
        case 'Triangle':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 34 25">
                    <path stroke="currentColor" d="m.76 24.66 16-23.546 16 23.546"/>
                </svg>
            )
            // break
        case 'Square':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 34 26">
                    <path stroke="currentColor" d="M32.76 24.594V1.05h-16v23.545h-16"/>
                </svg>
            )
            // break
        default:
            return
            // break
    }
}