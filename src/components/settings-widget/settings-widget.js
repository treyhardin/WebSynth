import { useEffect, useRef } from "react"
import Waves from "../icons/waves"
import WaveIcons from "../icons/wave-icons"
import Slider from "../slider/slider"
import { Logo } from '../icons/logo.js'
import { effectsSettings } from "../../midi-config"

import './settings-widget.css'
import { getNameFromNoteNumber } from "../../helpers/helpers"

export default function SettingsWidget(props) {

    const waveIcon = useRef(null)

    return (
        <div className="settings-widget">


          <div className="setting-header">

                {props.notes ? 
                <div className="setting-display-wrapper">
                  <p className="setting-display-title utility">Notes</p>
                  <div className="setting-display">
                    {Object.entries(props.notes).map(([note, i]) => {
                      return <p key={note + i} className="setting-notes utility">{getNameFromNoteNumber(note)}</p>
                    })}
                    
                  </div>
                </div>
                : null}
                
                {props.VCFType ? 
                <div className="setting-display-wrapper">
                  <p className="setting-display-title hide-mobile-landscape utility">Filter</p>
                  <div className="type-toggle-wrapper text-toggle-wrapper">
                    {effectsSettings.filterTypes.map((filterType) => {
                      return <button key={filterType} onClick={() => props.setVCFType(filterType)} className={`type-toggle utility ${filterType == props.VCFType ? 'active' : 'inactive' }`}>{filterType}</button>
                    })}
                  </div> 
                </div>
                : null }

                {props.VCOWaveType ? 
                <div className="setting-display-wrapper">
                  <p className="setting-display-title utility">VCO</p>
                  <div className="setting-display hide-mobile-landscape">
                    {/* <p className="setting-display-title utility">VCO</p> */}
                    <div className="setting-display-icon" ref={waveIcon}>
                      <Waves waveType={props.VCOWaveType} />
                    </div>
                  </div>
                  <div className="type-toggle-wrapper">
                    {effectsSettings.oscillatorWaveTypes.map((oscillatorType) => {
                      return <button key={oscillatorType} onClick={() => props.setVCOType(oscillatorType)} className={`type-toggle utility ${oscillatorType == props.VCOWaveType ? 'active' : 'inactive' }`}><WaveIcons waveType={oscillatorType} /></button>
                    })}
                  </div> 
                </div>
                : null }

                {props.LFOWaveType ? 
                <div className="setting-display-wrapper">
                  <p className="setting-display-title utility">LFO</p>
                  <div className="setting-display hide-mobile-landscape">
                    {/* <p className="setting-display-title utility">LFO</p> */}
                    <div className="setting-display-icon" ref={waveIcon}>
                      <Waves waveType={props.LFOWaveType} />
                    </div>
                  </div> 

                  <div className="type-toggle-wrapper">
                    {effectsSettings.oscillatorWaveTypes.map((oscillatorType) => {
                      return <button key={oscillatorType} onClick={() => props.setLFOType(oscillatorType)} className={`type-toggle utility ${oscillatorType == props.LFOWaveType ? 'active' : 'inactive' }`}><WaveIcons waveType={oscillatorType} /></button>
                    })}
                  </div> 
                </div>
                : null }

          </div>

        {props.info ? 
          <div className="setting-sliders">
            {Object.entries(props.settings).map (([key, value]) => {
              return (
                  <Slider 
                    label={key} 
                    key={key} 
                    min={value.min}
                    max={value.max}
                    setter={value.setter}
                    value={Math.round((value.state + Number.EPSILON) * 100) / 100} 
                  />
              )
            })
            }
            {/* {Object.entries(props.info).map (([key, value]) => {
              return (
                  <Slider label={key} key={key} value={Math.round((value + Number.EPSILON) * 100) / 100} />
              )
            })
            } */}
          </div>
          : null }

          {/* <Slider /> */}
          
        </div>
    )
}