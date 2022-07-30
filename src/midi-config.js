// MIDI Notes to Access Control
export const midiMapping = {

    // LFOFrequencyInput: 1,

    VCOTypeInput: 74,
    VCAGainInput: 18,

    LFOWaveTypeInput: 71,
    LFOGainInput: 19,
    
    VCFTypeInput: 76,
    LFOFrequencyInput: 16,

    VCFFrequencyInput: 17,
    VCFQInput: 91,

    VCFGainInput: 79,
    
    outputGainInput: 72,

    /* ---- Arturia Minilab Mapping ----

    Pitch Bend
    -0

    Slider
    -1

    Top Row Knobs
    -74
    -71
    -76
    -77
    93
    73
    75

    Bottom Row Knobs
    -18
    -19
    -16
    -17
    -91
    -79
    -72
    ----------------------------------- */





}

// Effect Controls
export const effectsSettings = {

    // Oscillator Wave Types
    oscillatorWaveTypes: ['Sine', 'Sawtooth', 'Triangle', 'Square'], // Defined by WebMIDI API
    filterTypes: ['Lowpass', 'Highpass', 'Bandpass', 'Lowshelf', 'Highshelf', 'Peaking', 'Notch', 'Allpass'],

    // VCO 
    VCOTypeDefault: 'Sine', // From oscillatorWaveTypes options

    // VCA
    VCAGainDefault: 0.03,
    VCAGainMin: 0,
    VCAGainMax: 0.1,

    //LFO 
    LFOTypeDefault: 'Sine', // From oscillatorWaveTypes options
    LFOFrequencyDefault: 1, // Range: 0 - 22050
    LFOFrequencyMin: 0,
    LFOFrequencyMax: 10,
    LFOGainDefault: 0.01,
    LFOGainMin: 0,
    LFOGainMax: 100.05,
    LFOPatchDefault: 'Cutoff', // 'Cutoff', 'VCA', 'VCO'

    // VCF
    VCFTypeDefault: 'Lowpass', // Lowpass, Highpass, Bandpass, Lowshelf, Highshelf, Peaking, Notch, Allpass
    
    VCFQDefault: 0,
    VCFQMin: -3.4,
    VCFQMax: 3.4,
    
    VCFFrequencyDefault: 2500, // 0 - 24000
    VCFFrequencyMin: 0,
    VCFFrequencyMax: 3000,
    
    VCFGainDefault: 0,
    VCFGainMin: -3.4,
    VCFGainMax: 50,

    // Output
    outputGainDefault: 3,
    outputGainMin: 0,
    outputGainMax: 3,
    
    
}

export const synthPresets = [
    {
        name: 'Electric Organ',
        VCOTypeDefault: 'Sine', // From oscillatorWaveTypes options
        VCAGainDefault: 0.03,
        LFOTypeDefault: 'Sine', // From oscillatorWaveTypes options
        LFOFrequencyDefault: 3, // Range: 0 - 22050
        LFOGainDefault: 4.5,
        LFOPatchDefault: 'VCO', // 'Cutoff', 'VCO'
        VCFTypeDefault: 'Lowpass', // Lowpass, Highpass, Bandpass, Lowshelf, Highshelf, Peaking, Notch, Allpass
        VCFQDefault: 0,
        VCFFrequencyDefault: 2500, // 0 - 24000
        VCFGainDefault: 0
    },
    {
        name: 'Electric Organ',
        VCOTypeDefault: 'Sine', // From oscillatorWaveTypes options
        VCAGainDefault: 0.03,
        LFOTypeDefault: 'Sine', // From oscillatorWaveTypes options
        LFOFrequencyDefault: 3, // Range: 0 - 22050
        LFOGainDefault: 4.5,
        LFOPatchDefault: 'VCO', // 'Cutoff', 'VCO'
        VCFTypeDefault: 'Lowpass', // Lowpass, Highpass, Bandpass, Lowshelf, Highshelf, Peaking, Notch, Allpass
        VCFQDefault: 0,
        VCFFrequencyDefault: 2500, // 0 - 24000
        VCFGainDefault: 0
    }

]