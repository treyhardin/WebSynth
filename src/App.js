import { useEffect } from 'react';
import './App.css';
import Synth from './components/synth/synth';



function App() {

  useEffect(() => {

    // Disable iOS Highlighting
    // document.addEventListener('touchstart', function(e) { e.preventDefault(); });


    // Disable Pinch Zoom
    const disablePinchZoom = (e) => {
      if (e.touches.length > 1) {
        e.preventDefault()
      }
    }
    document.addEventListener("touchmove", disablePinchZoom, { passive: false })
    return () => {
      document.removeEventListener("touchmove", disablePinchZoom)
    }
    

  },[])
  
  return (
    <div className="App">
      <Synth />
    </div>
  );
}

export default App;
