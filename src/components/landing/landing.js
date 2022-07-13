import {useState} from 'react'
import { FullscreenEnabled } from '../../App'
import { useFullscreenContext, useFullscreenUpdateContext } from '../../contexts/FullscreenContext'

import './landing.css'

export default function Landing() {

  const isFullscreen = useFullscreenContext()
  const toggleFullscreen = useFullscreenUpdateContext()

  if (!isFullscreen) {
    return (
      <section className="landing-screen">
        <h1>Welcome</h1>
        <button onClick={toggleFullscreen}>Launch</button>
      </section>
    )
  }

  
}