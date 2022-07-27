import { useEffect, useRef } from 'react'
import './slider.css'

export default function Slider(props) {

    const sliderContainer = useRef()
    const sliderInput = useRef()

    const resizeSlider = () => {
        let containerHeight = sliderContainer.current.offsetHeight;
        let containerWidth = sliderContainer.current.offsetWidth;
        sliderContainer.current.style.setProperty('--input-height', containerHeight + 'px')
        sliderContainer.current.style.setProperty('--input-width', containerWidth + 'px')
        console.log(`${containerWidth} x ${containerHeight}`)
        // sliderInput.current.s
    }

    useEffect(() => {
        if (sliderContainer.current && sliderInput.current) {
            resizeSlider()
            window.addEventListener('resize', resizeSlider())
        }
    }, [sliderInput])


    return (
        <div className='slider-wrapper'>
            
            <p className='slider-label utility'>{props.label}</p>
            
            <div className="slider" ref={sliderContainer}>
                <input className='rangeInput' type='range' name="slider-input" min={props.min} step={(props.max - props.min) / 200} max={props.max} onChange={(e) => props.setter(e.target.valueAsNumber)} ref={sliderInput} value={props.value}></input>
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