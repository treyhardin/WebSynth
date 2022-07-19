import './App.css';
import Synth from './components/synth/synth';



function App() {

  /**
   * Update CSS vh unit to match *actual* viewport height even in Safari. See
   * https://css-tricks.com/the-trick-to-viewport-units-on-mobile/ for more info.
   */
  const setVh = () => {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty("--vh", `${vh}px`)
  }

  setVh()

  window.addEventListener('resize', () => {
    setVh()
  })
  
  return (
    <div className="App">
      <Synth />
    </div>
  );
}

export default App;
