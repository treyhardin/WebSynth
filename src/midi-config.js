// MIDI Notes to Access Control
export const midiMapping = {

    LFOFrequencyInput: 1,

    VCOTypeInput: 74,
    VCAGainInput: 18,

    LFOWaveTypeInput: 71,
    LFOGainInput: 19,

    VCFTypeInput: 76,
    VCFGainInput: 16,

    VCFFrequencyInput: 77,
    VCFQInput: 17,
    


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
    91
    79
    72
    ----------------------------------- */





}

// Effect Controls
export const effectsSettings = {

    // VCO 
    VCOTypeDefault: 'Sine', // Sine, Sawtooth, Triangle, Square

    // VCA
    VCAGainDefault: 0.03,
    VCAGainMin: 0,
    VCAGainMax: 0.1,

    //LFO 
    LFOTypeDefault: 'Sine', // (Sine, Sawtooth, Triangle, Square)
    LFOFrequencyDefault: 1, // Range: 0 - 22050
    LFOFrequencyMin: 0,
    LFOFrequencyMax: 10,
    LFOGainDefault: 0.01,
    LFOGainMin: 0,
    LFOGainMax: 0.05,

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