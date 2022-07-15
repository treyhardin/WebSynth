// MIDI Notes to Access Control
export const midiMapping = {
    vcoWaveTypeInput: 74,
    vcaGainInput: 18,

    lfoWaveTypeInput: 71,
    lfoFrequencyInput: 19,

    lfoGainInput: 76,

    vcfTypeInput: 77,
    vcfFrequencyInput: 16,
    
    vcfQInput: 16,
    outputGainInput: 72,
    // highPassFrequencyInput: 76,
    // lowPassFrequencyInput: 77

    /*
    Top Row
    -74
    -71
    -76
    77
    93
    73
    75

    Bottom Row
    -18
    -19
    -16
    17
    91
    79
    72
    */





}

// Effect Controls
export const effectsSettings = {
    // VCO
    // vcoGainDefault: 0.2,
    // VCA
    vcaGainDefault: 0.1,
    vcaGainMin: 0,
    vcaGainMax: 0.2,
    // VCF Frequency Range: 0 - 22050
    vcfTypeDefault: 'lowpass',
    vcfQMin: 0,
    vcfQMax: 2000,
    vcfQDefault: 0,
    vcfFrequencyMin: 0,
    vcfFrequencyMax: 2000,
    vcfFrequencyDefault: 350,
    // LFO Gain
    lfoGainDefault: 0.2,
    lfoGainMin: 0,
    lfoGainMax: 1,
    // LFO Frequency Range: 0 - 22050
    lfoFrequencyMin: 0,
    lfoFrequencyMax: 10,
    lfoFrequencyDefault: 0.1,
    // Output Gain
    outputGainMin: -2,
    outputGainMax: 2,
    outputGainDefault: 0,
}