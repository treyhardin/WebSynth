export default function WaveIcons(props) {
    switch (props.waveType){
        case 'Sawtooth':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 42 14">
                    <path stroke="currentColor" d="M.903 6.922v5l10-10v10l10-10v10l10-10v10l10-10v5"/>
                </svg>
            )
            // break
        case 'Sine':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 41 12">
                    <path stroke="currentColor" d="M.903 10.746c4.366 0 .634-10 5-10s.634 10 5 10 .634-10 5-10 .634 10 5 10 .634-10 5-10 .634 10 5 10 .634-10 5-10 .634 10 5 10"/>
                </svg>
            )
            // break
        case 'Triangle':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 42 14">
                    <path stroke="currentColor" d="m.903 1.987 5 10 5-10 5 10 5-10 5 10 5-10 5 10 5-10"/>
                </svg>
            )
            // break
        case 'Square':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 42 12">
                    <path stroke="currentColor" d="M.903 5.532v5h5v-10h5v10h5v-10h5v10h5v-10h5v10h5v-10h5v5"/>
                </svg>
            )
            // break
        default:
            return
            // break
    }
}