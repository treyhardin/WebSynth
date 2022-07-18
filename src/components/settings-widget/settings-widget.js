import { useEffect, useRef } from "react"
import WaveIcons from "../icons/wave-icons"

import './settings-widget.css'

export default function SettingsWidget(props) {

    const waveIcon = useRef(null)

    useEffect(() => {
      if (props.icon) {
        waveIcon.current.style.setProperty("--max", props.max + '%')
        waveIcon.current.style.setProperty("--min", props.min + '%')
      }

    }, [props])

    return (
        <div className="settings-widget-wrapper">
          {props.icon ? 
            <div className="settings-widget-icon" ref={waveIcon}>
              <p className="settings-widget-label label">{props.label}</p>
              <WaveIcons waveType={props.waveType} />
            </div>
            : 
            <div className="settings-widget-text">
                <p className="settings-widget-label label">{props.label}</p>
            </div>
          }
          <div className="settings-widget-info">
            {Object.entries(props.info).map (([key, value]) => {
              return (
                <div key={key} className="widget-info-text">
                  <p className="settings-info-label label">{key}&nbsp;</p>
                  <p className="label"> {Math.round((value + Number.EPSILON) * 100) / 100}</p>
                </div>
              )
            })
            }
          </div>
          
        </div>
    )
}