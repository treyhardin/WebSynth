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

  // Tone Wave State
  const [ toneWave, setToneWave ] = useState(null)
  const toneWaveRef = useRef()
  toneWaveRef.current = toneWave
  let toneWaves = ['Sine', 'Sawtooth', 'Square', 'Triangle']

  // VCO Wave State
  const [ vcoWave, setVcoWave ] = useState(null)
  const vcoWaveRef = useRef()
  vcoWaveRef.current = vcoWave
  let vcoWaves = ['Sine', 'Sawtooth', 'Square', 'Triangle']
  let vcoOscillator;
  let vcoGain;

  // High Pass State
  const [ highPassFrequency, setHighPassFrequency ] = useState(null)
  const highPassFrequencyRef = useRef()
  highPassFrequencyRef.current = highPassFrequency

  // Low Pass State
  const [ lowPassFrequency, setLowPassFrequency ] = useState(null)
  const lowPassFrequencyRef = useRef()
  lowPassFrequencyRef.current = lowPassFrequency

  // Set Initial Values
  useEffect(() => {
    if (isFullscreen && !audioContext) {
        audioContext = new AudioContext();

        vcoOscillator = audioContext.createOscillator();
        vcoOscillator.type = vcoWaveRef.current.toLowerCase();

        vcoGain = audioContext.createGain();
        vcoGain.gain.value = effectsSettings.vcoGainDefault;

        vcoOscillator.connect(vcoGain)

        vcoOscillator.start()

    }

    setToneWave(toneWaves[0])
    setVcoWave(toneWaves[0])
    setHighPassFrequency(effectsSettings.highPassDefault)
    setLowPassFrequency(effectsSettings.lowPassDefault)

  }, [isFullscreen])


  /*-----MIDI Input------*/

  // Setup Web MIDI API
  const onMIDISuccess = (midiAccess) => {
    midiAccess.addEventListener('stateChange', updateDevices)

    const inputs = midiAccess.inputs;

    // Hacky Way to Remove Empty MIDI Ports
    inputs.forEach((input) => {
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
  }

  window.AudioContext = window.AudioContext || window.webkitAudioContext
  let audioContext;


  /*-----Helpers------*/

  // Normalize Values
  const normalize = (input, maxInput, minOutput, maxOutput) => {
    return input / maxInput * (maxOutput - minOutput) + minOutput
  }


  /*-----Handle MIDI Messages------*/

  // Create Empty Objects for Active Attributes
  const oscillators = {};
  // const highPassFilters = {};
  // const lowPassFilters = {};

  // Get Currently Playing Notes
  const updateActiveNotes = (noteData) => {
    setActiveNotes(() => {
      let newNotes = []
      Object.entries(oscillators).map(([key, value]) => {
        return newNotes.push({key, value, noteData})
        // console.log(noteData)
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

    // console.log(vcoGain)

    let note = midiMessage.data[1]
    let velocity = midiMessage.data[2]

    if (audioContext) {
      
      console.log(vcoOscillator)

        
      // Create Oscillator
      let oscillator = audioContext.createOscillator();
      let noteString = note.toString()

      // Create Oscillator Gain
      let oscillatorGain = audioContext.createGain();
      oscillatorGain.gain.value = effectsSettings.oscillatorGain;

      oscillator.gain = oscillatorGain
      oscillator.type = toneWaveRef.current.toLowerCase()
      oscillator.frequency.value = midiToFrequency(note)

      // Create Velocity Gain
      let velocityGain = audioContext.createGain();
      let velocityGainValue = (1 / 127) * velocity
      velocityGain.gain.value = velocityGainValue
      oscillator.velocity = velocityGainValue

      // Create High Pass Filter
      let highPassFilter = new BiquadFilterNode(audioContext, {
        type: 'highpass',
        frequency: highPassFrequencyRef.current,
        // Q: -3.2
      })
      // highPassFilters[note] = highPassFilter
      oscillator.highPassFilter = highPassFilter

      // Create Low Pass Filter
      let lowPassFilter = new BiquadFilterNode(audioContext, {
        type: 'lowpass',
        frequency: lowPassFrequencyRef.current,
        // Q: -3.2
      })
      // lowPassFilters[note] = lowPassFilter
      oscillator.lowPassFilter = lowPassFilter

      // Create Oscillator Object
      oscillators[noteString] = oscillator

      // Connect Modules
      // oscillator.connect(vcoGain)
      // vcoGain.connect(oscillatorGain)
      oscillator.connect(oscillatorGain)
      oscillatorGain.connect(velocityGain)
      velocityGain.connect(highPassFilter)
      highPassFilter.connect(lowPassFilter)
      highPassFilter.connect(audioContext.destination)

      oscillator.start()

      updateActiveNotes(midiMessage)

    }

  }

  // NOTE OFF
  const noteOff = (midiMessage) => {

    let note = midiMessage.data[1]
    // console.log("Note Off")

    if (audioContext) {
      let noteString = note.toString()
      const currentOscillator = oscillators[noteString]

      if (currentOscillator) {
        const currentGain = currentOscillator.gain
        let fadeOut = 0.003;
        currentGain.gain.setValueAtTime(currentGain.gain.value, audioContext.currentTime)
        currentGain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + fadeOut)
        delete oscillators[noteString]

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

  const updateOscillators = (attribute, updatedValue) => {
    Object.entries(oscillators).map(([key, value]) => {
      return value[attribute] = updatedValue
    })
  }

  // updateOscillators('frequency.value', highPassFrequencyRef.current)


  // RANGE
  const rangeInput = (midiMessage) => {

    // console.log(midiMessage)
    
    let inputNumber = midiMessage.data[1]
    let inputValue = midiMessage.data[2]

    switch (inputNumber) {

      case midiMapping.toneWaveInput:
        let toneWaveStepSize = 128 / toneWaves.length
        let toneWaveIndex = Math.floor(inputValue / toneWaveStepSize)
        setToneWave(toneWaves[toneWaveIndex])
        break

      case midiMapping.vcoWaveInput:
        let vcoWaveStepSize = 128 / vcoWaves.length
        let vcoWaveIndex = Math.floor(inputValue / vcoWaveStepSize)
        setVcoWave(vcoWaves[vcoWaveIndex])
        break

      case midiMapping.highPassFrequencyInput:
        let normalizedHighPassFrequency = normalize(inputValue, 127, effectsSettings.highPassMin, effectsSettings.highPassMax)
        setHighPassFrequency(normalizedHighPassFrequency)
        updateOscillators('frequency.value', highPassFrequencyRef.current)
        // Object.entries(highPassFilters).map(([key, value]) => {
        //   return value.frequency.value = highPassFrequencyRef.current
        //   // console.log(value.frequency)
        // })
        break

      case midiMapping.lowPassFrequencyInput:
        let normalizedLowPassFrequency = normalize(inputValue, 127, effectsSettings.lowPassMin, effectsSettings.lowPassMax)
        setLowPassFrequency(normalizedLowPassFrequency)
        updateOscillators('frequency.value', lowPassFrequencyRef.current)
        // Object.entries(lowPassFilters).map(([key, value]) => {
        //   return value.frequency.value = lowPassFrequencyRef.current
        // })
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


  return (
    <section className="input-section">
      <section className="settings-wrapper">
        <WaveWidget 
          label="Tone" 
          waveType={toneWave} 
          min={normalize(highPassFrequencyRef.current, effectsSettings.highPassMax, 0, 50)} 
          max={normalize(lowPassFrequencyRef.current, effectsSettings.lowPassMax, 0, 50)} 
        />
        {/* <WaveWidget 
          label="VCO" 
          waveType={vcoWave} 
          min={normalize(highPassFrequencyRef.current, effectsSettings.highPassMax, 0, 50)} 
          max={normalize(lowPassFrequencyRef.current, effectsSettings.lowPassMax, 0, 50)} 
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
    </section>
  )
}