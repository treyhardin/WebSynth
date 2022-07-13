# Raspberry Pi Synth

A simple React-based synthesizer built on the [Web MIDI API](https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API) and [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API). Originally built for Raspberry Pi with a mini display, but compatible with any modern web browser.

## [Live Demo](www.google.com)

## Get Started

### NPM Install
You know the drill. Install project dependencies. There aren't a ton, pretty much just standard React stuff.

### `npm run startHTTPS`

Run `npm run startHTTPS` to start a localhost server with HTTPS enabled. This is currently required by most browsers to enable the MIDI API. Runs on [https://localhost:3000](https://localhost:3000).

This should also have live reload enabled, but it can be finicky so ya know, just refresh every now and then.

## MIDI Configuration

The MIDI mappings were originally set up for the [Arturia Minilab Mk II](https://www.arturia.com/products/hybrid-synths/minilab-mkii/overview) but can easily be configured for other devices. All core settings can be accessed via `src/components/midi-input/midi-config.js`. I'll probably add a MIDI configuration step in the frontend, but who knows.
