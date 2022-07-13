import { useContext, useState, createContext } from 'react';
import './App.css';
import MIDIInput from './components/midi-input/midi-input';
import Landing from './components/landing/landing';
import { FullscreenProvider } from './contexts/FullscreenContext';
import { MIDIInputProvider } from './contexts/MIDIInputContext';
import Synth from './components/synth/synth';

export const FullscreenEnabled = createContext()


function App() {
  
  return (
    <div className="App">
      <FullscreenProvider>
        <MIDIInputProvider>
          <Landing />
          <MIDIInput />
          {/* <Synth /> */}
        </MIDIInputProvider>
      </FullscreenProvider>
    </div>
  );
}

export default App;
