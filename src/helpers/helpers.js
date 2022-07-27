// Normalize to New Range
export const normalize = (input, maxInput, minOutput, maxOutput) => {
    return input / maxInput * (maxOutput - minOutput) + minOutput
}

// Convert MIDI Note to Frequency
export const midiNoteToFrequency = (number) => {
    const a = 440;
    return Math.round((a / 32) * (2 ** ((number - 9) / 12)))
}

// Get Note Name
export const getNameFromNoteNumber = (number) => {
    let notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    return notes[number % 12]
}

// Get Octave
export const getOctaveFromNoteNumber = (number) => {
    return Math.floor(number / 12)  
}

// Generate Note Color
export const getColorFromNote = (number) => {
    return {
        backgroundColor: `hsl(${number % 12 * 30} , 100%, 50%)`
    }
}