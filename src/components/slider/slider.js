import { useEffect, useRef } from 'react'
import './slider.css'

export default function Slider(props) {

    return (
        <div className='slider-wrapper'>
            
            {props.patchSetter ?
            <button className={`slider-label utility patch-option ${props.activePatch === props.label ? 'active' : null}`} onClick={() => props.patchSetter(props.label)}>{props.label}</button>
            : <p className='slider-label utility'>{props.label}</p> }
            
            <div className="slider">
                <div className='range-input-wrapper'>
                    <input className='range-input' type='range' name="slider-input" min={props.min} step={(props.max - props.min) / 200} max={props.max} onChange={(e) => props.setter(e.target.valueAsNumber)} value={props.value}></input>
                </div>
                <div className="slider-ticks">
                    <div className="slider-tick"></div>
                    <div className="slider-tick"></div>
                    <div className="slider-tick"></div>
                    <div className="slider-tick"></div>
                    <div className="slider-tick"></div>
                    <div className="slider-tick"></div>
                    <div className="slider-tick"></div>
                    <div className="slider-tick"></div>
                    <div className="slider-tick"></div>
                </div>
            </div>
            <p className='slider-value hide-mobile-landscape utility'>{props.value}</p>
        </div>
    )
}