// MIDI Notes to Access Control
export const midiMapping = {
    toneWaveInput: 74,
    vcoWaveInput: 71,
    highPassFrequencyInput: 76,
    lowPassFrequencyInput: 77

    /*
    Top Row
    -74
    -71
    -76
    -77
    93
    73
    75

    Bottom Row
    18
    19
    16
    17
    91
    79
    72
    */





}

// Effect Controls
export const effectsSettings = {
    // Tone
    oscillatorGain: 0.3,
    // VCO
    vcoGainDefault: 0.2,
    // High Pass Range: 0 - 22050
    highPassMin: 0,
    highPassMax: 2000,
    highPassDefault: 350,
    // Low Pass Range: 0 - 22050
    lowPassMin: 0,
    lowPassMax: 2000,
    lowPassDefault: 350,
}