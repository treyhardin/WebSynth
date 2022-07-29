import { useEffect, useState, useRef } from 'react'
import { effectsSettings } from '../../midi-config'
import { midiNoteToFrequency } from '../../helpers/helpers'
import Landing from '../landing/landing'
import './synth.css'
import SettingsWidget from '../settings-widget/settings-widget'
import DetectInput from '../input/detect-input'
import MIDIInput from '../input/midi-input'
import QWERTYInput from '../input/qwerty-input'
import VirtualKeyboard from '../virtual-keyboard/virtual-keyboard'

export default function Synth(props) {

    // Synth Active State
    const [ synthActive, setSynthActive ] = useState(false)
    let synthActiveRef = useRef()
    synthActiveRef.current = synthActive

    // Audio Content State
    const [ audioContext, setAudioContext ] = useState(null)
    let audioContextRef = useRef()
    audioContextRef.current = audioContext

    // Hacky State to Force Rerender on Input Change
    const [ inputStatus, setInputStatus ] = useState(false)

    // Input Type State
    const [ inputType, setInputType ] = useState(null)
    let inputTypeRef = useRef()
    inputTypeRef.current = inputType

    // Touch Controls State
    const [ touchControls, setTouchControls ] = useState(false)

    const setNewInputType = (type) => {
        setInputType(type)
    }

    // On-Screen Keyboard State
    const [ virtualKeyboard, setVirtualKeyboard ] = useState(null)
    let virtualKeyboardRef = useRef()
    virtualKeyboardRef.current = virtualKeyboard

    /*-- Synth States --*/

    // Active Notes State
    const [ activeNotes, setActiveNotes ] = useState({})

    // Octave State
    const [octave, setOctave] = useState(0)
    const octaveRef = useRef()
    octaveRef.current = octave

    // VCO Wave Type State
    const [ VCOType, setVCOType ] = useState(null)
    const VCOTypeRef = useRef()
    VCOTypeRef.current = VCOType

    // VCA Wave State
    const [ VCAGain, setVCAGain ] = useState(null)
    const VCAGainRef = useRef()
    VCAGainRef.current = VCAGain

    // LFO State
    const [ LFO, setLFO ] = useState(null)
    const LFORef = useRef()
    LFORef.current = LFO

    // LFO Wave Type State
    const [ LFOType, setLFOType ] = useState(null)
    const LFOTypeRef = useRef()
    LFOTypeRef.current = LFOType

    // LFO Frequency State
    const [ LFOFrequency, setLFOFrequency ] = useState(null)
    const LFOFrequencyRef = useRef()
    LFOFrequencyRef.current = LFOFrequency

    // LFO Gain State
    const [ LFOGain, setLFOGain ] = useState(null)
    const LFOGainRef = useRef()
    LFOGainRef.current = LFOGain

    // LFO Patch State
    const [ LFOPatch, setLFOPatch ] = useState(null)
    const LFOPatchRef = useRef()
    LFOPatchRef.current = LFOPatch

    // VCF Type State
    const [ VCFType, setVCFType ] = useState(null)
    const VCFTypeRef = useRef()
    VCFTypeRef.current = VCFType

    // VCF Frequency State
    const [ VCFFrequency, setVCFFrequency ] = useState(null)
    const VCFFrequencyRef = useRef()
    VCFFrequencyRef.current = VCFFrequency

    // VCF Q State
    const [ VCFQ, setVCFQ ] = useState(null)
    const VCFQRef = useRef()
    VCFQRef.current = VCFQ

    // VCF Gain State
    const [ VCFGain, setVCFGain ] = useState(null)
    const VCFGainRef = useRef()
    VCFGainRef.current = VCFGain

    // VCF Gain State
    const [ outputGain, setOutputGain ] = useState(null)
    const outputGainRef = useRef()
    outputGainRef.current = outputGain


    /*-- Set Initial States --*/

    // Initialize Audio Context
    window.AudioContext = window.AudioContext || window.webkitAudioContext

    useEffect(() => {
        
        // Set Synth Defaults
        setVCOType(effectsSettings.VCOTypeDefault)
        setVCAGain(effectsSettings.VCAGainDefault)
        setLFOType(effectsSettings.LFOTypeDefault)
        setLFOGain(effectsSettings.LFOGainDefault)
        setVCFType(effectsSettings.VCFTypeDefault)
        setVCFFrequency(effectsSettings.VCFFrequencyDefault)
        setVCFQ(effectsSettings.VCFQDefault)
        setVCFGain(effectsSettings.VCFGainDefault)
        setOutputGain(effectsSettings.outputGainDefault)
        setLFOPatch(effectsSettings.LFOPatchDefault)
        
        // Create Audio Context
        if(synthActiveRef.current && !audioContext) {
            setAudioContext(new AudioContext())
        }

        // Create Global LFO
        if (audioContextRef.current) {
            let newLFO = audioContext.createOscillator()
            newLFO.type = LFOTypeRef.current.toLowerCase()
            newLFO.frequency.value = effectsSettings.LFOFrequencyDefault
            setLFOFrequency(newLFO.frequency.value)
            setLFO(newLFO)
            newLFO.start()
        }
        
    }, [synthActive, audioContext, virtualKeyboard])

    /*-- Handle Inputs --*/

    const keyDownHandler = (note, velocity) => {

        // Create VCO (Base Tone Oscillator)
        let VCO = audioContextRef.current.createOscillator()
        VCO.type = VCOTypeRef.current.toLowerCase()
        VCO.frequency.value = midiNoteToFrequency(note)
        VCO.start(audioContextRef.current.currentTime)

        // Create VCA (Base Tone Gain)
        let VCA = audioContextRef.current.createGain()
        VCA.gain.value = (VCAGainRef.current / 127) * velocity;
        VCO.VCA = VCA

        // Create LFO Gain
        let LFOGain = audioContextRef.current.createGain()
        LFOGain.gain.value = LFOGainRef.current;
        LFORef.current.connect(LFOGain)
        LFORef.current.LFOGain = LFOGain

        // Add LFO to Object
        LFORef.current.LFOGain.gain.value = LFOGainRef.current
        LFORef.current.frequency.value = LFOFrequencyRef.current
        LFORef.current.type = LFOTypeRef.current.toLowerCase()
        VCO.LFO = LFORef.current

        // Create VCF
        let VCF = new BiquadFilterNode(audioContextRef.current, {
            type: VCFTypeRef.current.toLowerCase(),
            q: VCFQRef.current,
            frequency: VCFFrequencyRef.current,
            gain: VCFGainRef.current
        })
        VCO.VCF = VCF
        
        // Create Output Gain
        let output = audioContextRef.current.createGain()
        output.gain.value = outputGainRef.current
        VCO.output = output

        // Patch LFO
        switch (LFOPatchRef.current) {
            case 'Cutoff':
                LFORef.current.LFOGain.connect(VCF.frequency)
                break
            case 'VCO':
                LFORef.current.LFOGain.connect(VCO.frequency)
                break
            default:
                LFORef.current.LFOGain.connect(VCF.frequency)
        }

        // Connect Modules
        VCO.connect(VCA)
        VCA.connect(VCF)
        VCF.connect(output)
        output.connect(audioContextRef.current.destination)

        // Update Active Notes
        let newActiveNotes = activeNotes
        newActiveNotes[note] = VCO
        VCO.note = note
        setActiveNotes(newActiveNotes)

        // Force Re-Render
        setInputStatus(inputStatus => !inputStatus)

    }

    const keyUpHandler = (note, velocity) => {

        const currentOscillator = activeNotes[note]

        // Fade Out VCA Gain
        let fadeOut = 0.03;
        const currentOutputGain = currentOscillator.output
        currentOutputGain.gain.setValueAtTime(currentOutputGain.gain.value, audioContextRef.current.currentTime)
        currentOutputGain.gain.exponentialRampToValueAtTime(0.00001, audioContextRef.current.currentTime + fadeOut)

        // Stop Oscillator
        setTimeout(() => {
            currentOscillator.stop()
            currentOscillator.disconnect()
        }, fadeOut + 20)

        // Remove From Active Notes
        let newActiveNotes = activeNotes
        delete newActiveNotes[note]
        setActiveNotes(newActiveNotes)

        // Force Re-Render
        setInputStatus(inputStatus => !inputStatus)

    }

    const VCOTypeInputHandler = (vcoType) => {
        setVCOType(vcoType)
        Object.entries(activeNotes).map(([key, value]) => {
            return value['type'] = vcoType.toLowerCase()
        })
    }

    const VCAGainInputHandler = (vcaGain) => {
        setVCAGain(vcaGain)
        Object.entries(activeNotes).map(([key, value]) => {
            return value['VCA']['gain']['value'] = vcaGain
        })
    }

    const LFOTypeInputHandler = (lfoType) => {
        setLFOType(lfoType)
        Object.entries(activeNotes).map(([key, value]) => {
            return value['LFO']['type'] = lfoType.toLowerCase()
        })
    }

    const LFOFrequencyInputHandler = (frequency) => {
        setLFOFrequency(frequency)
        Object.entries(activeNotes).map(([key, value]) => {
            return value['LFO']['frequency']['value'] = frequency
        })
    }

    const LFOGainInputHandler = (lfoGain) => {
        setLFOGain(lfoGain)
        Object.entries(activeNotes).map(([key, value]) => {
            return value['LFO']['LFOGain']['gain']['value'] = lfoGain
        })
    }

    const LFOPatchInputHandler = (lfoPatch) => {
        setLFOPatch(lfoPatch)
        Object.entries(activeNotes).map(([key, value]) => {

            value['LFO']['LFOGain'].disconnect()

            switch (lfoPatch) {
                case 'Cutoff':
                    value['LFO']['LFOGain'].connect(value['VCF']['frequency'])
                    break
                case 'VCO':
                    value['LFO']['LFOGain'].connect(value['frequency'])
                    break
                default:
                    value['LFO']['LFOGain'].connect(value['VCF']['frequency'])
            }
        })
    }

    const VCFTypeInputHandler = (vcfType) => {
        setVCFType(vcfType)
        Object.entries(activeNotes).map(([key, value]) => {
            return value['VCF']['type'] = vcfType.toLowerCase()
        })
    }

    const VCFQInputHandler = (vcfQ) => {
        setVCFQ(vcfQ)
        Object.entries(activeNotes).map(([key, value]) => {
            return value['VCF']['q'] = vcfQ
        })
    }

    const VCFFrequencyInputHandler = (frequency) => {
        setVCFFrequency(frequency)
        Object.entries(activeNotes).map(([key, value]) => {
            return value['VCF']['frequency']['value'] = frequency
        })
    }

    const VCFGainInputHandler = (vcfGain) => {
        setVCFGain(vcfGain)
        Object.entries(activeNotes).map(([key, value]) => {
            return value['VCF']['gain']['value'] = vcfGain
        })
    }

    const outputGainInputHandler = (outputGain) => {
        setOutputGain(outputGain)
        Object.entries(activeNotes).map(([key, value]) => {
            return value['output']['gain']['value'] = outputGain
        })
    }

    const pitchBendHandler = (note, velocity) => {

        let inputValue = velocity - 127 / 2
        let pitchBendStrength = 13.082 / 63.5 * 2
    
        Object.entries(activeNotes).map(([key, value]) => {
            let originalFrequency = midiNoteToFrequency(key)
            return value.frequency.value = originalFrequency + inputValue * pitchBendStrength
        })
    }

    const padDownHandler = (input) => {
        console.log("Pad Down")
    }

    const padUpHandler = (input) => {
        console.log("Pad Up")
    }

    const aftertouchHandler = (input) => {
        console.log("Aftertouch")
    }
    
    return (

        <>

        <Landing 
            // activateSynth={activateSynth} 
            synthActive={synthActiveRef.current} 
            setAudioContext={setAudioContext}
            setSynthActive={setSynthActive} 
            setNewInputType={setNewInputType}
            inputType={inputTypeRef.current}
        />
        
        <div className='synth-wrapper'>
            <DetectInput 
                setInputType={setNewInputType}
                setTouchControls={setTouchControls}
            />
            <MIDIInput 
                synthActive={synthActive}
                inputType={inputType}
                setInputType={setNewInputType}
                keyDownHandler={keyDownHandler} 
                keyUpHandler={keyUpHandler}
                padDown={padDownHandler}
                padUp={padUpHandler}
                aftertouch={aftertouchHandler}
                pitchBendHandler={pitchBendHandler}
                VCOTypeInputHandler={VCOTypeInputHandler}
                VCAGainInputHandler={VCAGainInputHandler}
                LFOTypeInputHandler={LFOTypeInputHandler}
                LFOFrequencyInputHandler={LFOFrequencyInputHandler}
                LFOGainInputHandler={LFOGainInputHandler}
                VCFTypeInputHandler={VCFTypeInputHandler}
                VCFQInputHandler={VCFQInputHandler}
                VCFFrequencyInputHandler={VCFFrequencyInputHandler}
                VCFGainInputHandler={VCFGainInputHandler}
                outputGainInputHandler={outputGainInputHandler}
            />
            <QWERTYInput 
                synthActive={synthActiveRef.current}
                inputType={inputTypeRef.current}
                keyDownHandler={keyDownHandler} 
                keyUpHandler={keyUpHandler}
                octave={octaveRef.current}
                // octave={octave}
                setOctave={setOctave}
            />


            <section className='settings-wrapper'>

                <SettingsWidget 
                    // label="Master" 
                    icon={false}
                    info={{'Master': outputGainRef.current}}
                    settings={{
                        'Master': {
                            'state': outputGainRef.current,
                            'min': effectsSettings.outputGainMin,
                            'max': effectsSettings.outputGainMax,
                            'setter': outputGainInputHandler
                        }
                    }}
                    notes={activeNotes}
                />

                <SettingsWidget 
                    label="LFO" 
                    VCOWaveType={VCOTypeRef.current}
                    setVCOType={VCOTypeInputHandler}
                    LFOWaveType={LFOTypeRef.current}
                    setLFOType={LFOTypeInputHandler}
                    setLFOFrequency={setLFOFrequency}
                    settings={{
                        'VCO': {
                            'state': VCAGainRef.current,
                            'min': effectsSettings.VCAGainMin,
                            'max': effectsSettings.VCAGainMax,
                            'setter': VCAGainInputHandler,
                            'patchSetter': LFOPatchInputHandler,
                            'activePatch': LFOPatchRef.current
                        },
                        'LFO': {
                            'state': LFOGainRef.current,
                            'min': effectsSettings.LFOGainMin,
                            'max': effectsSettings.LFOGainMax,
                            'setter': LFOGainInputHandler
                        },
                        'freq': {
                            'state': LFOFrequencyRef.current,
                            'min': effectsSettings.LFOFrequencyMin,
                            'max': effectsSettings.LFOFrequencyMax,
                            'setter': LFOFrequencyInputHandler
                        }
                    }}
                />
            
                <SettingsWidget 
                    VCFType={VCFTypeRef.current}
                    setVCFType={VCFTypeInputHandler}
                    label="Filter"
                    settings={{
                        'Cutoff': {
                            'state': VCFFrequencyRef.current,
                            'min': effectsSettings.VCFFrequencyMin,
                            'max': effectsSettings.VCFFrequencyMax,
                            'setter': VCFFrequencyInputHandler,
                            'patchSetter': LFOPatchInputHandler,
                            'activePatch': LFOPatchRef.current
                        },
                        'Q': {
                            'state': VCFQRef.current,
                            'min': effectsSettings.VCFQMin,
                            'max': effectsSettings.VCFQMax,
                            'setter': VCFQInputHandler
                        },
                        'Gain': {
                            'state': VCFGainRef.current,
                            'min': effectsSettings.VCFGainMin,
                            'max': effectsSettings.VCFGainMax,
                            'setter': VCFGainInputHandler
                        }
                    }}
                />
                
            </section>

            <VirtualKeyboard 
                synthActive={synthActive}
                inputType={inputType}
                touchControls={touchControls}
                keyDownHandler={keyDownHandler} 
                keyUpHandler={keyUpHandler}
                octave={octaveRef.current}
                setOctave={setOctave}
                activeNotes={activeNotes}
            />
        
            {/* {inputType === 'midi' ? : null } */}
        
        </div>

        </>
    )
}