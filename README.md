# Raspberry Pi Synth

A simple React-based synthesizer built on the [Web MIDI API](https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API) and [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API). Originally built for Raspberry Pi with a mini display, but compatible with any modern web browser. Only works with MIDI controller connected (for now).

## [Live Demo](https://raspberry-pi-synth-6it2xbja4-treyhardin.vercel.app/)

## Get Started

### `npm install`
You know the drill. Install project dependencies. There aren't a ton, pretty much just standard React stuff.

### `npm run startHTTPS`

Run to start a localhost server with HTTPS enabled. This is currently required by most browsers to enable the MIDI API. Runs on [https://localhost:3000](https://localhost:3000).

This should also have live reload enabled, but it can be finicky so ya know, just refresh every now and then.

### `Have Fun 🎉`

Set up is pretty easy, so at this point you should be jamming on your MIDI keyboard. 

## MIDI Configuration

The MIDI mappings were originally set up for the [Arturia Minilab Mk II](https://www.arturia.com/products/hybrid-synths/minilab-mkii/overview) but can easily be configured for other devices. All core settings can be accessed via `src/components/midi-input/midi-config.js`. I'll probably add a MIDI configuration step in the frontend at some point but, but 🤷‍♂️.

## Coming Soon

Up next, I'm gonna be adding more advanced synth features such as VCO, VCA, additional filters, etc. Stay tuned.
