import { useRef, useState, useEffect, useCallback } from "react";
// import { debounce, min } from "lodash";
import { midiMapping, effectsSettings } from './midi-config'
import WaveWidget from "../wave-widget/wave-widget";
import { useFullscreenContext } from '../../contexts/FullscreenContext'
import './midi-input.css'

export default function MIDIInput() {

  /*-----State Management------*/

  // Full Screen Context
  const isFullscreen = useFullscreenContext()

  // Active Notes State
  const [activeNotes, setActiveNotes] = useState([])

  // VCO Wave State
  const [ vcoWave, setVcoWave ] = useState(null)
  const vcoWaveRef = useRef()
  vcoWaveRef.current = vcoWave
  let vcoWaves = ['Sine', 'Sawtooth', 'Square', 'Triangle']

  // VCA State
  const [ vcaGain, setVcaGain ] = useState(null)
  const vcaGainRef = useRef()
  vcaGainRef.current = vcaGain

  // LFO State
  const [ lfoOscillator, setLfoOscillator ] = useState(null)
  const lfoOscillatorRef = useRef()
  lfoOscillatorRef.current = lfoOscillator

  // LFO Wave Type State
  const [ lfoWaveType, setLfoWaveType ] = useState(null)
  const lfoWaveTypeRef = useRef()
  lfoWaveTypeRef.current = lfoWaveType
  let lfoWaveTypes = ['Sine', 'Sawtooth', 'Square', 'Triangle']
  let lfoTime;

  // LFO Gain State
  const [ lfoGain, setLfoGain ] = useState(null)
  const lfoGainRef = useRef()
  lfoGainRef.current = lfoGain

  // LFO Frequency State
  const [ lfoFrequency, setLfoFrequency ] = useState(null)
  const lfoFrequencyRef = useRef()
  lfoFrequencyRef.current = lfoFrequency

  // VCF Filter Type
  const [ vcfFilter, setVcfFilter ] = useState(null)
  const vcfFilterRef = useRef()
  vcfFilterRef.current = vcfFilter
  let vcfFilters = ['Lowpass', 'Highpass', 'Bandpass', 'HighShelf', 'LowShelf', 'Peaking', 'Allpass', 'Notch']

  // VCF Frequency
  const [ vcfFrequency, setVcfFrequency ] = useState(null)
  const vcfFrequencyRef = useRef()
  vcfFrequencyRef.current = vcfFrequency

  // VCF Q
  const [ vcfQ, setVcfQ ] = useState(null)
  const vcfQRef = useRef()
  vcfQRef.current = vcfQ

  // Output Gain
  const [ outputGain, setOutputGain ] = useState(null)
  const outputGainRef = useRef()
  outputGainRef.current = outputGain
  

  // Set Initial Values
  useEffect(() => {
    
    setVcoWave(vcoWaves[0])
    setVcaGain(effectsSettings.vcaGainDefault)

    setLfoWaveType(lfoWaveTypes[0])
    setLfoFrequency(effectsSettings.lfoFrequencyDefault)
    setLfoGain(effectsSettings.lfoGainDefault)

    setVcfFilter(vcfFilters[0])
    setVcfFrequency(effectsSettings.vcfFrequencyDefault)
    setVcfQ(effectsSettings.vcfQDefault)
    setOutputGain(effectsSettings.outputGainDefault)

    if (isFullscreen && !audioContext) {
      window.AudioContext = window.AudioContext || window.webkitAudioContext
      audioContext = new AudioContext();
      // audioContext.resume()
      console.log(audioContext)
      lfoTime = audioContext.currentTime;

      let newLfoOscillator = audioContext.createOscillator();
      newLfoOscillator.type = lfoWaveType.toLowerCase()
      newLfoOscillator.frequency.value = effectsSettings.lfoFrequencyDefault
      setLfoOscillator(newLfoOscillator)

      let lfoGain = audioContext.createGain();
      lfoGain.gain.value = effectsSettings.lfoGainDefault;
      setLfoGain(lfoGain.gain.value)

      newLfoOscillator.connect(lfoGain)
      newLfoOscillator.lfoGain = lfoGain
      
      newLfoOscillator.start(lfoTime)

  }

  }, [isFullscreen])


  /*-----MIDI Input------*/

  // Setup Web MIDI API
  const onMIDISuccess = (midiAccess) => {
    // console.log("Midi SuccesS!")
    midiAccess.addEventListener('stateChange', updateDevices)

    const inputs = midiAccess.inputs;

    // Hacky Way to Remove Empty MIDI Ports
    inputs.forEach((input) => {

      // console.log(input)
      if (input.manufacturer !== '') {
        input.addEventListener('midimessage', getMIDIMessage)
      }
    })
  }

  const updateDevices = (devices) => {
    console.log("Device Change")
  }

  const onMIDIFailure = () => {
    console.log('Could not access your MIDI devices.');
  }

  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure)
  } else {
    console.log("Browser does not support MIDI access")
  }

  
  let audioContext;


  /*-----Helpers------*/

  // Normalize Values
  const normalize = (input, maxInput, minOutput, maxOutput) => {
    return input / maxInput * (maxOutput - minOutput) + minOutput
  }


  /*-----Handle MIDI Messages------*/

  // Create Empty Objects for Active Attributes
  const synthVoices = {};

  // Get Currently Playing Notes
  const updateActiveNotes = (noteData) => {
    setActiveNotes(() => {
      let newNotes = []
      Object.entries(synthVoices).map(([key, value]) => {
        return newNotes.push({key, value, noteData})
      })
      return newNotes
    })
  }

  // Convert MIDI Note to Frequency
  const midiToFrequency = (number) => {
    const a = 440;
    return (a / 32) * (2 ** ((number - 9) / 12))
  }

  // NOTE ON
  const noteOn = (midiMessage) => {

    let note = midiMessage.data[1]
    let velocity = midiMessage.data[2]

    if (audioContext) {


      // Create VCO Oscillator
      let vcoOscillator = audioContext.createOscillator();
      vcoOscillator.type = vcoWaveRef.current.toLowerCase()
      vcoOscillator.frequency.value = midiToFrequency(note)

      // Create VCA
      let vcaGain = audioContext.createGain();
      vcaGain.gain.value = vcaGainRef.current;
      vcoOscillator.vcaGain = vcaGain

      vcoOscillator.lfoOscillator = lfoOscillator;

      // Create LFO Oscillator
      // let lfoOscillator = audioContext.createOscillator();
      // lfoOscillator.type = lfoWaveTypeRef.current.toLowerCase()
      // lfoOscillator.frequency.value = effectsSettings.lfoFrequencyDefault
      // vcoOscillator.lfoOscillator = lfoOscillator;

      // Create LFO Gain
      // let lfoGain = audioContext.createGain();
      // lfoGain.gain.value = lfoGainRef.current;
      // vcoOscillator.lfoGain = lfoGain

      // Create VCF Filter
      let vcfFilter = new BiquadFilterNode(audioContext, {
        type: vcfFilterRef.current.toLowerCase(),
        frequency: vcfFrequencyRef.current,
        Q: vcfQRef.current
      })
      vcoOscillator.vcfFilter = vcfFilter
      vcoOscillator.vcfFilter = vcfFilter;
      
      // Create Output Gain
      let outputGain = audioContext.createGain();
      let outputGainValue = (1 / 127) * velocity
      outputGain.gain.value = outputGainValue
      vcoOscillator.outputGain = outputGain

      // Create Synth Voice Object
      let noteString = note.toString()
      synthVoices[noteString] = vcoOscillator

      // Connect Modules
      

      lfoOscillatorRef.current.lfoGain.connect(vcaGain.gain)
      vcoOscillator.connect(vcaGain)


      vcaGain.connect(vcfFilter)
      vcfFilter.connect(outputGain)

      // lfoOscillatorRef.current.connect(lfoGain)
      // lfoGain.connect(vcfFilter.frequency)

      // outputGain.connect(audioContext.destination)

      vcaGain.connect(audioContext.destination)

      // lfoOscillatorRef.current.lfoGain.connect(audioContext.destination)

      vcoOscillator.start(lfoTime)
      // lfoOscillator.start(lfoTime)

      updateActiveNotes(midiMessage)

    }

  }

  // NOTE OFF
  const noteOff = (midiMessage) => {

    let note = midiMessage.data[1]

    if (audioContext) {
      let noteString = note.toString()
      const currentOscillator = synthVoices[noteString]

      if (currentOscillator) {
        let fadeOut = 0.003;

        

        // const currentGain = currentOscillator.outputGain
        const currentVcaGain = currentOscillator.vcaGain
        // const currentLfoGain = currentOscillator.lfoGain
        
        currentVcaGain.gain.setValueAtTime(currentVcaGain.gain.value, audioContext.currentTime)
        currentVcaGain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + fadeOut)

        
        delete synthVoices[noteString]

        setTimeout(() => {
          currentOscillator.stop()
          currentOscillator.disconnect()
        }, fadeOut + 20)
      } 

      updateActiveNotes(midiMessage)
    }

  }

  // PAD ON
  const padOn = (midiMessage) => {
    console.log("Pad On")
  }

  // PAD OFF
  const padOff = (midiMessage) => {
    console.log("Pad Off")
  }

  // AFTERTOUCH
  const aftertouch = (midiMessage) => {
    console.log("Aftertouch")
  }

  // PITCH-BEND
  const pitchBend = (midiMessage) => {
    console.log("Pitch Bend")
  }

  const updateSynthVoices = (attribute, updatedValue) => {
    Object.entries(synthVoices).map(([key, value]) => {
      // console.log(value)
      value[attribute] = updatedValue
      // console.log(value)
    })
  }

  // updateSynthVoices('frequency.value', highPassFrequencyRef.current)


  // RANGE
  const rangeInput = (midiMessage) => {

    // console.log(midiMessage)
    
    let inputNumber = midiMessage.data[1]
    let inputValue = midiMessage.data[2]

    switch (inputNumber) {

      case midiMapping.vcoWaveTypeInput:
        let vcoWaveStepSize = 128 / vcoWaves.length
        let vcoWaveIndex = Math.floor(inputValue / vcoWaveStepSize)
        setVcoWave(vcoWaves[vcoWaveIndex])
        // updateSynthVoices('type', vcoWaves[vcoWaveIndex].toLowerCase())
        Object.entries(synthVoices).map(([key, value]) => {
          value['type'] = vcoWaves[vcoWaveIndex].toLowerCase()
        })
        break

      case midiMapping.vcaGainInput:
        let normalizedVcaGain = normalize(inputValue, 127, effectsSettings.vcaGainMin, effectsSettings.vcaGainMax)
        setVcaGain(normalizedVcaGain)
        Object.entries(synthVoices).map(([key, value]) => {
          // console.log(value)
          value['vcaGain']['gain']['value'] = normalizedVcaGain
        })
        break

      case midiMapping.lfoWaveTypeInput:
        let lfoWaveTypeStepSize = 128 / lfoWaveTypes.length
        let lfoWaveTypeIndex = Math.floor(inputValue / lfoWaveTypeStepSize)
        setLfoWaveType(lfoWaveTypes[lfoWaveTypeIndex])
        if(lfoWaveTypeRef.current) {
          lfoOscillatorRef.current.type = lfoWaveTypeRef.current.toLowerCase()
        }
        break

      case midiMapping.lfoFrequencyInput:
        let normalizedLfoFrequency = normalize(inputValue, 127, effectsSettings.lfoFrequencyMin, effectsSettings.lfoFrequencyMax)
        setLfoFrequency(normalizedLfoFrequency)
        if(lfoOscillatorRef.current){
          lfoOscillatorRef.current.frequency.value = normalizedLfoFrequency
        }
        break

      case midiMapping.lfoGainInput:
        let normalizeLfoGain = normalize(inputValue, 127, effectsSettings.lfoGainMin, effectsSettings.lfoGainMax)
        setLfoGain(normalizeLfoGain)
        if(lfoOscillatorRef.current) {
          lfoOscillatorRef.current.lfoGain.gain.value = normalizeLfoGain
        }
        break

      case midiMapping.vcfTypeInput:
        let vcfStepSize = 128 / vcfFilters.length
        let vcfWaveIndex = Math.floor(inputValue / vcfStepSize)
        setVcfFilter(vcfFilters[vcfWaveIndex])
        Object.entries(synthVoices).map(([key, value]) => {
          value['vcfFilter']['type'] = vcfFilterRef.current.toLowerCase()
        })
        break

      case midiMapping.vcfFrequencyInput:
        let normalizedVcfFrequency = normalize(inputValue, 127, effectsSettings.vcfFrequencyMin, effectsSettings.vcfFrequencyMax)
        setVcfFrequency(normalizedVcfFrequency)
        Object.entries(synthVoices).map(([key, value]) => {
          value['vcfFilter']['frequency']['value'] = normalizedVcfFrequency
        })
        break

      case midiMapping.outputGainInput:
        let normalizedOutputGain = normalize(inputValue, 127, effectsSettings.outputGainMin, effectsSettings.outputGainMax)
        setVcfFrequency(normalizedVcfFrequency)
        Object.entries(synthVoices).map(([key, value]) => {
          value['vcfFilter']['frequency']['value'] = normalizedVcfFrequency
        })
        break

    }
  }
  
  // MIDI Input Listener
  const getMIDIMessage = (midiMessage) => {
    switch (midiMessage.data[0]) {
      case 144:
        noteOn(midiMessage)
        break
      case 128:
        noteOff(midiMessage)
        break
      case 153:
        padOn(midiMessage)
        break
      case 169:
        console.log("Aftertouch")
        break
      case 137:
        padOff(midiMessage)
        break
      case 176:
        rangeInput(midiMessage)
        break
      case 224:
        pitchBend(midiMessage)
        break
    }
  }


  /*-----Display Functions------*/

  // Get Note Name
  let getNameFromNoteNumber = (number) => {
    let notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    return notes[number % 12]
  }

  // Get Octave
  let getOctaveFromNoteNumber = (number) => {
    return Math.floor(number / 12)
  }

  // Generate Note Color
  let getColorFromNote = (number) => {
    return {
      backgroundColor: `hsl(${number % 12 * 30} , 100%, 50%)`
    }
  }

  // let roundDecimal = (number) => {
  //   Math.round((number + Number.EPSILON) * 100) / 100}
  // }


  return (
    <section className="input-section">
      <section className="settings-wrapper">
        {/* <p>{lfoGainRef.current}</p> */}
        {/* <p>lfo freq: {lfoFrequencyRef.current}</p> */}
        {/* <p>lfo gain: {lfoFrequencyRef.current.lfoGain.gain.value}</p> */}
        <WaveWidget 
          label="VCO" 
          waveType={vcoWaveRef.current} 
          icon={true}
          info={{'gain': vcaGainRef.current}}
          gain={vcaGainRef.current}
          // min={normalize(highPassFrequencyRef.current, effectsSettings.highPassMax, 0, 50)} 
          // max={normalize(lowPassFrequencyRef.current, effectsSettings.lowPassMax, 0, 50)} 
        /> 
        <WaveWidget 
          label="LFO" 
          waveType={lfoWaveType} 
          info={{'freq': lfoFrequencyRef.current, 'gain': lfoGainRef.current}}
          icon={true}
          // gain={}
          // min={normalize(highPassFrequencyRef.current, effectsSettings.highPassMax, 0, 50)} 
          // max={normalize(lowPassFrequencyRef.current, effectsSettings.lowPassMax, 0, 50)} 
        />
        {/* <WaveWidget 
          label="VCF" 
          waveType={vcfFilter} 
          icon={false}
          // min={normalize(highPassFrequencyRef.current, effectsSettings.highPassMax, 0, 50)} 
          // max={normalize(lowPassFrequencyRef.current, effectsSettings.lowPassMax, 0, 50)} 
        /> */}
      </section>
      <div className="notes-wrapper">
        {activeNotes.length <= 0 ? <p className="note-placeholder">Play a Key</p> : null}
        {activeNotes.map((note) => {
          return (
            <div key={note.key} className="note-card" style={getColorFromNote(note.key)}>
              <p className="note-name">{getNameFromNoteNumber(note.key)}</p>
              <p className="note-octave">{getOctaveFromNoteNumber(note.key)}</p>
            </div>
          )
        })}
      </div>
      <p></p>
    </section>
  )
}