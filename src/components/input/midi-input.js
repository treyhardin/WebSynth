import { midiMapping, effectsSettings } from "../../midi-config"
import { normalize } from "../../helpers/helpers"

import { useEffect, useState, useRef } from "react"

// MIDI
// Virtual Keybaord (Click & Keydown)

export default function MIDIInput(props) {

    const [ MIDIDevices, setMIDIDevices ] = useState(null)
    let MIDIDevicesRef = useRef()
    MIDIDevicesRef.current = MIDIDevices

    useEffect(() => {
        if (props.inputType === 'midi') {
            navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure)
        }
    }, [props.inputType])

    // Handle MIDI Success
    const onMIDISuccess = (midiAccess) => {

        // Get Compatible Inputs
        const inputs = midiAccess.inputs;

        if (inputs.size <= 0) {
            props.setInputType('virtualKeyboard')
        }

        inputs.forEach((input) => {
            input.addEventListener('midimessage', getMIDIMessage)
        })
    }

    // Handle MIDI Failure
    const onMIDIFailure = () => {
        props.setNewInputType('virtualKeyboard')
        console.log('Could Not Connect to MIDI Device. Switching to Virtual Keyboard.')
    }

    // MIDI Input Listener
    const getMIDIMessage = (midiMessage) => {

        let note = midiMessage.data[1]
        let velocity = midiMessage.data[2]

        // Map MIDI Inputs
        switch (midiMessage.data[0]) {
            case 144:
                props.keyDownHandler(note, velocity)
                break
            case 128:
                props.keyUpHandler(note, velocity)
                break
            case 176:
                rangeInputHandler(note, velocity)
                break
            case 153:
                props.padDown(note, velocity)
                break
            case 137:
                props.padUp(note, velocity)
                break
            case 169:
                props.aftertouch(note, velocity)
                break
            case 224:
                props.pitchBendHandler(note, velocity)
                break
            default:
                break
        }

    }

    const rangeInputHandler = (note, velocity) => {

        let oscillatorToggleStepSize = 127 / (effectsSettings.oscillatorWaveTypes.length - 1)
        let filterToggleStepSize = 127 / (effectsSettings.filterTypes.length - 1)
        
        switch (note) {
    
            case midiMapping.VCOTypeInput:
                let VCOWaveTypeIndex = Math.round(velocity / oscillatorToggleStepSize)
                let VCOType = effectsSettings.oscillatorWaveTypes[VCOWaveTypeIndex]
                props.VCOTypeInputHandler(VCOType)
                break

            case midiMapping.VCAGainInput:
                let normalizedVCAGain = normalize(velocity, 127, effectsSettings.VCAGainMin, effectsSettings.VCAGainMax)
                props.VCAGainInputHandler(normalizedVCAGain)
                break

            case midiMapping.LFOWaveTypeInput:
                let LFOWaveTypeIndex = Math.floor(velocity / oscillatorToggleStepSize)
                let LFOtype = effectsSettings.oscillatorWaveTypes[LFOWaveTypeIndex]
                props.LFOTypeInputHandler(LFOtype)
                break

            case midiMapping.LFOFrequencyInput:
                let normalizedLFOFrequency = normalize(velocity, 127, effectsSettings.LFOFrequencyMin, effectsSettings.LFOFrequencyMax)
                props.LFOFrequencyInputHandler(normalizedLFOFrequency)
                break

            case midiMapping.LFOGainInput:
                let normalizedLFOGain = normalize(velocity, 127, effectsSettings.LFOGainMin, effectsSettings.LFOGainMax)
                props.LFOGainInputHandler(normalizedLFOGain)
                break

            case midiMapping.VCFTypeInput:
                let VCFTypeIndex = Math.round(velocity / filterToggleStepSize)
                let VCFType = effectsSettings.filterTypes[VCFTypeIndex]
                props.VCFTypeInputHandler(VCFType)
                break

            case midiMapping.VCFQInput:
                let normalizedVCFQ = normalize(velocity, 127, effectsSettings.VCFQMin, effectsSettings.VCFQMax)
                props.VCFQInputHandler(normalizedVCFQ)
                break

            case midiMapping.VCFFrequencyInput:
                let normalizedVCFFrequency = normalize(velocity, 127, effectsSettings.VCFFrequencyMin, effectsSettings.VCFFrequencyMax)
                props.VCFFrequencyInputHandler(normalizedVCFFrequency)
                break

            case midiMapping.VCFGainInput:
                let normalizedVCFGain = normalize(velocity, 127, effectsSettings.VCFGainMin, effectsSettings.VCFGainMax)
                props.VCFGainInputHandler(normalizedVCFGain)
                break

            case midiMapping.outputGainInput:
                let normalizedOutputGain = normalize(velocity, 127, effectsSettings.outputGainMin, effectsSettings.outputGainMax)
                props.outputGainInputHandler(normalizedOutputGain)
                break

            default:
                break
        }
    }
        
}



