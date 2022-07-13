import { useEffect, useRef } from "react"
import WaveIcons from "../icons/wave-icons"

import './wave-widget.css'

export default function WaveWidget(props) {

    const waveIcon = useRef(null)

    useEffect(() => {
        waveIcon.current.style.setProperty("--max", props.max + '%')
        waveIcon.current.style.setProperty("--min", props.min + '%')

        // console.log(props.max)
    }, [props])

    return (
        <div className="wave-widget-wrapper">
            
          <div className="wave-widget-icon" ref={waveIcon}><WaveIcons waveType={props.waveType} /></div>
          <div className="wave-widget-text">
            <p className="wave-widget-label label">{props.label}</p>
            <p className="wave-widget-name">{props.waveType}</p>
          </div>
          
        </div>
    )
}