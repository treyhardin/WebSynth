import { useEffect, useRef } from "react"
import WaveIcons from "../icons/wave-icons"

import './wave-widget.css'

export default function WaveWidget(props) {

    const waveIcon = useRef(null)

    useEffect(() => {
      if (props.icon) {
        waveIcon.current.style.setProperty("--max", props.max + '%')
        waveIcon.current.style.setProperty("--min", props.min + '%')
      }

        // console.log(props.max)
    }, [props])

    return (
        <div className="wave-widget-wrapper">
          {props.icon ? 
            <div className="wave-widget-icon" ref={waveIcon}>
              <p className="wave-widget-label label">{props.label}</p>
              <WaveIcons waveType={props.waveType} />
            </div>
            : null
          }
          <div className="wave-widget-text">
            {/* <p className="wave-widget-label label">{props.label}</p> */}
            {/* {props.gain ? 
              <span>
                <p>Gain:</p>
                <p>{Math.round((props.gain + Number.EPSILON) * 100) / 100}</p>
              </span> : null
            } */}
            {Object.entries(props.info).map (([key, value]) => {
              return (
                <div key={key} className="widget-info-text">
                  <p className="widget-info-label label">{key}/</p>
                  <p className="label"> {Math.round((value + Number.EPSILON) * 100) / 100}</p>
                </div>
              )
            })
            }
            {/* <p className="wave-widget-name">{props.waveType}</p> */}
          </div>
          
        </div>
    )
}