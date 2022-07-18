import { useEffect, useState, useRef } from 'react'
import { effectsSettings, midiMapping } from '../../midi-config'
import { midiNoteToFrequency, getColorFromNote, getNameFromNoteNumber, getOctaveFromNoteNumber, normalize } from '../../helpers/helpers'
import Input from '../input/input'
import Landing from '../landing/landing'
import './synth.css'
import SettingsWidget from '../settings-widget/settings-widget'


export default function Synth(props) {

    const [ synthActive, setSynthActive ] = useState(false)
    let synthActiveRef = useRef()
    synthActiveRef = synthActive

    const [ audioContext, setAudioContext ] = useState(null)
    let audioContextRef = useRef()
    audioContextRef.current = audioContext

    const [ inputStatus, setInputStatus ] = useState(false)


    /*-- Synth States --*/

    let waveTypes = ['Sine', 'Sawtooth', 'Square', 'Triangle']

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

    // Available VCF Types - Enable More if You Want
    let VCFTypes = ['Lowpass', 'Highpass'] // 'Bandpass', 'Lowshelf', 'Highshelf', 'Peaking', 'Notch', 'Allpass'

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

    // Set Synth Defaults
    useEffect(() => {

        setVCOType(effectsSettings.VCOTypeDefault)
        setVCAGain(effectsSettings.VCAGainDefault)
        setLFOType(effectsSettings.LFOTypeDefault)
        setLFOGain(effectsSettings.LFOGainDefault)

        setVCFType(effectsSettings.VCFTypeDefault)
        setVCFFrequency(effectsSettings.VCFFrequencyDefault)
        setVCFQ(effectsSettings.VCFQDefault)
        setVCFGain(effectsSettings.VCFGainDefault)

        setOutputGain(effectsSettings.outputGainDefault)
        
        if(synthActive && !audioContext) {
            setAudioContext(new AudioContext())
        }

        if (audioContextRef.current) {

            // Create LFO
            let newLFO = audioContext.createOscillator()
            newLFO.type = LFOTypeRef.current.toLowerCase()
            newLFO.frequency.value = effectsSettings.LFOFrequencyDefault
            setLFOFrequency(newLFO.frequency.value)

            setLFO(newLFO)
            newLFO.start()
        }
        
    }, [synthActive, audioContext])

    const activateSynth = () => {
        setSynthActive(true)
    }

    /*-- Handle Inputs --*/

    const keyDownHandler = (input) => {

        let note = input.data[1]
        let velocity = input.data[2]

        // Create VCO (Base Tone Oscillator)
        let VCO = audioContextRef.current.createOscillator();
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

    const keyUpHandler = (input) => {

        let note = input.data[1]
        const currentOscillator = activeNotes[note]

        // Fade Out VCA Gain
        let fadeOut = 0.03;

        const currentOutputGain = currentOscillator.output
        currentOutputGain.gain.setValueAtTime(currentOutputGain.gain.value, audioContextRef.current.currentTime)
        currentOutputGain.gain.exponentialRampToValueAtTime(0.00001, audioContextRef.current.currentTime + fadeOut)

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

    const rangeHandler = (input) => {



        // console.log(input)

        let inputNumber = input.data[1]
        let inputValue = input.data[2]

        let waveToggleStepSize = 127 / (waveTypes.length - 1)
        let VCFToggleStepSize = 127 / (VCFTypes.length - 1)

        switch (inputNumber) {

            case midiMapping.VCOTypeInput:
                let VCOWaveTypeIndex = Math.round(inputValue / waveToggleStepSize)
                setVCOType(waveTypes[VCOWaveTypeIndex])
                Object.entries(activeNotes).map(([key, value]) => {
                    value['type'] = waveTypes[VCOWaveTypeIndex].toLowerCase()
                })
                break

            case midiMapping.VCAGainInput:
                let normalizedVCAGain = normalize(inputValue, 127, effectsSettings.VCAGainMin, effectsSettings.VCAGainMax)
                setVCAGain(normalizedVCAGain)
                Object.entries(activeNotes).map(([key, value]) => {
                    value['VCA']['gain']['value'] = normalizedVCAGain
                })
                break

            case midiMapping.LFOWaveTypeInput:
                let LFOWaveTypeIndex = Math.floor(inputValue / waveToggleStepSize)
                setLFOType(waveTypes[LFOWaveTypeIndex])

                Object.entries(activeNotes).map(([key, value]) => {
                    value['LFO']['type'] = waveTypes[LFOWaveTypeIndex].toLowerCase()
                })
                break

            case midiMapping.LFOFrequencyInput:
                let normalizedLFOFrequency = normalize(inputValue, 127, effectsSettings.LFOFrequencyMin, effectsSettings.LFOFrequencyMax)
                setLFOFrequency(normalizedLFOFrequency)

                Object.entries(activeNotes).map(([key, value]) => {
                    value['LFO']['frequency']['value'] = normalizedLFOFrequency
                })
                break

            case midiMapping.LFOGainInput:
                let normalizedLFOGain = normalize(inputValue, 127, effectsSettings.LFOGainMin, effectsSettings.LFOGainMax)
                setLFOGain(normalizedLFOGain)
                Object.entries(activeNotes).map(([key, value]) => {
                    value['LFO']['LFOGain']['gain']['value'] = normalizedLFOGain
                })
                break

            case midiMapping.VCFTypeInput:
                let VCFTypeIndex = Math.round(inputValue / VCFToggleStepSize)
                setVCFType(VCFTypes[VCFTypeIndex])
                Object.entries(activeNotes).map(([key, value]) => {
                    value['VCF']['type'] = VCFTypes[VCFTypeIndex].toLowerCase()
                })
                break

            case midiMapping.VCFQInput:
                let normalizedVCFQ = normalize(inputValue, 127, effectsSettings.VCFQMin, effectsSettings.VCFQMax)
                setVCFQ(normalizedVCFQ)
                Object.entries(activeNotes).map(([key, value]) => {
                    value['VCF']['q'] = normalizedVCFQ
                })
                break

            case midiMapping.VCFFrequencyInput:
                let normalizedVCFFrequency = normalize(inputValue, 127, effectsSettings.VCFFrequencyMin, effectsSettings.VCFFrequencyMax)
                setVCFFrequency(normalizedVCFFrequency)
                Object.entries(activeNotes).map(([key, value]) => {
                    value['VCF']['frequency']['value'] = normalizedVCFFrequency
                })
                break

            case midiMapping.VCFGainInput:
                let normalizedVCFGain = normalize(inputValue, 127, effectsSettings.VCFGainMin, effectsSettings.VCFGainMax)
                setVCFGain(normalizedVCFGain)
                Object.entries(activeNotes).map(([key, value]) => {
                    value['VCF']['gain']['value'] = normalizedVCFGain
                })
                break

            case midiMapping.outputGainInput:
                let normalizedOutputGain = normalize(inputValue, 127, effectsSettings.outputGainMin, effectsSettings.outputGainMax)
                setOutputGain(normalizedOutputGain)
                Object.entries(activeNotes).map(([key, value]) => {
                    // console.log(value)
                    value['output']['gain']['value'] = normalizedOutputGain
                })
                break

        }
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

    const pitchBendHandler = (input) => {

        let inputValue = input.data[2] - 127 / 2
        let pitchBendStrength = 13.082 / 63.5 * 2

        Object.entries(activeNotes).map(([key, value]) => {
            let originalFrequency = midiNoteToFrequency(key)
            value.frequency.value = originalFrequency + inputValue * pitchBendStrength
        })
    }
    
    return (
        <div className='synth-wrapper'>
        <Landing activateSynth={activateSynth} synthActive={synthActive} setAudioContext={setAudioContext} />
        <Input 
            keyDown={keyDownHandler} 
            keyUp={keyUpHandler}
            range={rangeHandler}
            padDown={padDownHandler}
            padUp={padUpHandler}
            aftertouch={aftertouchHandler}
            pitchBend={pitchBendHandler}
            synthActive
        />
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
            {Object.entries(activeNotes).length <= 0 ? 
                <p className='note-card note-placeholder'>🎹</p> :
                Object.entries(activeNotes).map(([key, value]) => {
                    return (
                        // <p key={key}>{value.note}</p>
                        <div key={key} className="note-card" style={getColorFromNote(key)}>
                            <p className="note-name">{getNameFromNoteNumber(key)}</p>
                            <p className="note-octave">{getOctaveFromNoteNumber(key)}</p>
                        </div>
                    )
                })
            }
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
                    // 'Q': VCFQRef.current,
                    'Gain': VCFGainRef.current
                }}
                // gain={vcaGainRef.current}
            />
        </section>
        
        </div>
    )
}