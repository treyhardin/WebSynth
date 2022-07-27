import { useEffect, useState, useRef } from 'react'
import { effectsSettings, midiMapping } from '../../midi-config'
import { midiNoteToFrequency, getColorFromNote, getNameFromNoteNumber, getOctaveFromNoteNumber, normalize } from '../../helpers/helpers'
import Input from '../input/input'
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

        if (virtualKeyboardRef.current) {
            let virtualKeys = virtualKeyboardRef.current.querySelectorAll('.keyboard-note')
            virtualKeys.forEach((virtualKey) => {
                virtualKey.addEventListener('mousedown', virtualKeyDownHandler)
                virtualKey.addEventListener('mouseup', virtualKeyUpHandler)
            })
        }
        
    }, [synthActive, audioContext, virtualKeyboard])

    /*-- Handle Inputs --*/

    const keyDownHandler = (note, velocity) => {

        // Console.log the input here and look for the 2nd item in the array to find your controller's input values
        // console.log(input)

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

        // Connect Modules
        LFORef.current.LFOGain.connect(VCA.gain)
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

    

    let currentVirtualKey;

    // virtualKeyboardRef.current

    const virtualKeyDownHandler = (e, keyDownData) => {

        // console.log(keyDownData)

        if (inputTypeRef.current === 'qwerty') {
            

            let virtualKey
            let virtualKeyNote
            let virtualKeyLabel

            if (keyDownData) {
                virtualKeyNote = keyDownData.data[1]
                virtualKey = document.querySelector(`[data-key-note='${virtualKeyNote}']`)
            } else {
                virtualKey = e.target
                virtualKeyLabel = virtualKey.dataset.keyLabel
                virtualKeyNote = virtualKey.dataset.keyNote
            }

            // console.log(virtualKeyNote)
            currentVirtualKey = virtualKey

            virtualKey.classList.add('pressed')
            keyDownHandler({data: [144, virtualKeyNote, 0]})


        }
    }

    const virtualKeyUpHandler = (e, keyUpData) => {

        if (inputTypeRef.current === 'qwerty') {

            let virtualKey
            let virtualKeyNote
            let virtualKeyLabel

            if (keyUpData) {
                virtualKeyNote = keyUpData.data[1]
                virtualKey = document.querySelector(`[data-key-note='${virtualKeyNote}']`)
            } else {
                virtualKey = e.target
                virtualKeyLabel = virtualKey.dataset.keyLabel
                virtualKeyNote = virtualKey.dataset.keyNote
            }

            // console.log(keyUpData)
            keyUpHandler({data: [144, virtualKeyNote, 0]})
            virtualKey.classList.remove('pressed')

        }
    }

    

    

    
    return (
        
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
                synthActive={synthActive}
                inputType={inputType}
            />
            <Landing 
                // activateSynth={activateSynth} 
                synthActive={synthActiveRef.current} 
                setAudioContext={setAudioContext}
                setSynthActive={setSynthActive} 
                setNewInputType={setNewInputType}
                inputType={inputTypeRef.current}
            />
            {/* <Input 
                keyDown={keyDownHandler} 
                keyUp={keyUpHandler}
                range={rangeHandler}
                padDown={padDownHandler}
                padUp={padUpHandler}
                aftertouch={aftertouchHandler}
                pitchBend={pitchBendHandler}
                synthActive={synthActiveRef.current}
                virtualKeyDown={virtualKeyDownHandler}
                virtualKeyUp={virtualKeyUpHandler}
                // inputType={inputType}
            /> */}
            <section className='oscillator-wrapper'>
                <SettingsWidget 
                    label="VCO" 
                    waveType={VCOTypeRef.current}
                    icon={true}
                    info={{'gain': VCAGainRef.current}}
                    // gain={vcaGainRef.current}
                />
                <SettingsWidget 
                    label="LFO" 
                    waveType={LFOTypeRef.current}
                    icon={true}
                    info={{
                        'freq': LFOFrequencyRef.current,
                        'gain': LFOGainRef.current
                    }}
                    // gain={vcaGainRef.current}
                />
        </section>
        <section className='notes-wrapper'>

            <VirtualKeyboard 
                synthActive={synthActive}
                touchControls={touchControls}
                keyDownHandler={keyDownHandler} 
                keyUpHandler={keyUpHandler}
            />
        
            {inputType === 'midi' ?
                Object.entries(activeNotes).length <= 0 ? 
                    <p className='note-card note-placeholder'>🎹</p> :
                    Object.entries(activeNotes).map(([key, value]) => {
                        return (
                            // <p key={key}>{value.note}</p>
                            <div key={key} className="note-card" style={getColorFromNote(key)}>
                                <h3 className="note-name">{getNameFromNoteNumber(key)}</h3>
                                <p className="note-octave label">{getOctaveFromNoteNumber(key)}</p>
                            </div>
                        )
                    }) : null
            }

            {/* {inputType === 'qwerty' ?
                <div className='keyboard-wrapper' ref={virtualKeyboardRef}>
                    <span data-key-label='a' data-key-note='48' className='keyboard-note label'>a</span>
                    <span data-key-label='w' data-key-note='49' className='keyboard-note black-note label'>w</span>
                    <span data-key-label='s' data-key-note='50' className='keyboard-note label'>s</span>
                    <span data-key-label='e' data-key-note='51' className='keyboard-note label black-note label'>e</span>
                    <span data-key-label='d' data-key-note='52' className='keyboard-note label'>d</span>
                    <span data-key-label='f' data-key-note='53' className='keyboard-note label'>f</span>
                    <span data-key-label='t' data-key-note='54' className='keyboard-note label black-note label'>t</span>
                    <span data-key-label='g' data-key-note='55' className='keyboard-note label'>g</span>
                    <span data-key-label='y' data-key-note='56' className='keyboard-note label black-note label'>y</span>
                    <span data-key-label='h' data-key-note='57' className='keyboard-note label'>h</span>
                    <span data-key-label='u' data-key-note='58' className='keyboard-note label black-note label'>u</span>
                    <span data-key-label='j' data-key-note='59' className='keyboard-note label'>j</span>

                    <span data-key-label='k' data-key-note='60' className='keyboard-note label'>k</span>
                    <span data-key-label='o' data-key-note='61' className='keyboard-note label black-note label'>o</span>
                    <span data-key-label='l' data-key-note='62' className='keyboard-note label'>l</span>
                    <span data-key-label='p' data-key-note='63' className='keyboard-note label black-note label'>p</span>
                    <span data-key-label=';' data-key-note='64' className='keyboard-note label'>;</span>
                </div>
                : null
            } */}


            
        </section>
        <section className='LFO-wrapper'>
            <span className='text-setting'>
                <p>{VCFTypeRef.current}</p>
            </span>
            
            <SettingsWidget 
                // label={VCFTypeRef.current}
                waveType={LFOTypeRef.current}
                icon={false}
                info={{
                    // 'type': VCFTypeRef.current,
                    'freq': VCFFrequencyRef.current,
                    'Q': VCFQRef.current,
                    'Gain': VCFGainRef.current,
                    'Master': outputGainRef.current
                }}
                // gain={vcaGainRef.current}
            />
        </section>
        
        </div>
    )
}