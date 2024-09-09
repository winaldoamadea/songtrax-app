import * as Tone from "tone";

// tone object and export it
export const toneObject = Tone;

// export tone transport
export const toneTransport = toneObject.Transport;

// export tone part for guitar
export const toneGuitarPart = new toneObject.Part((time, note) => {
    guitar.triggerAttackRelease(note, "8n", time);
}, []).start(0);

// export tone part for frenchhorn
export const toneFrenchPart = new toneObject.Part((time, note) => {
    frenchHorn.triggerAttackRelease(note, "8n", time);
}, []).start(0);

// export tone part for drums
export const toneDrumsPart = new toneObject.Part((time, note) => {
    drums.triggerAttackRelease(note, "8n", time);
}, []).start(0);

// export tone part for piano
export const tonePianoPart = new toneObject.Part((time, note) => {
    piano.triggerAttackRelease(note, "8n", time);
}, []).start(0);

// export tone object sampler for guitar
export const guitar = new toneObject.Sampler({
    urls: {
        "F3": "F3.mp3",
        "F#1": "Fs1.mp3",
        "F#2": "Fs2.mp3",
        "F#3": "Fs3.mp3",
        "G1": "G1.mp3",
        "G2": "G2.mp3",
        "G3": "G3.mp3",
        "G#1": "Gs1.mp3",
        "G#2": "Gs2.mp3",
        "G#3": "Gs3.mp3",
        "A1": "A1.mp3",
        "A2": "A2.mp3",
        "A3": "A3.mp3",
        "A#1": "As1.mp3",
        "A#2": "As2.mp3",
        "A#3": "As3.mp3",
        "B1": "B1.mp3",
        "B2": "B2.mp3",
        "B3": "B3.mp3",
        "C2": "C2.mp3",
        "C3": "C3.mp3",
        "C4": "C4.mp3",
        "C#2": "Cs2.mp3",
        "C#3": "Cs3.mp3",
        "C#4": "Cs4.mp3",
        "D1": "D1.mp3",
        "D2": "D2.mp3",
        "D3": "D3.mp3",
        "D4": "D4.mp3",
        "D#1": "Ds1.mp3",
        "D#2": "Ds2.mp3",
        "D#3": "Ds3.mp3",
        "E1": "E1.mp3",
        "E2": "E2.mp3",
        "E3": "E3.mp3",
        "F1": "F1.mp3",
        "F2": "F2.mp3",
    },
    release: 1,
    baseUrl: "/samples/guitar-acoustic/"
}).toDestination();

// export tone object sampler for piano
export const piano = new toneObject.Sampler({
    urls: {
        "C3": "C3.mp3",
        "C#3": "Cs3.mp3",
        "D3": "D3.mp3",
        "D#3": "Ds3.mp3",
        "E3": "E3.mp3",
        "F3": "F3.mp3",
        "F#3": "Fs3.mp3",
        "G3": "G3.mp3",
        "G#3": "Gs3.mp3",
        "A3": "A3.mp3",
        "A#3": "As3.mp3",
        "B3": "B3.mp3",
        // Add more keys as needed
    },
    release: 1,
    baseUrl: "/samples/piano/",
}).toDestination();

// export tone object sampler for french horn
export const frenchHorn = new toneObject.Sampler({
    urls: {
        "A3": "A1.mp3",
        "B3": "A3.mp3",
        "C3" : "C4.mp3",
        "D3" : "D3.mp3",
        "E3" : "Ds2.mp3",
        "F3" : "F3.mp3",
        "G3" : "G2.mp3"
        // Add more violin notes as needed
    },
    release: 1,
    baseUrl: "/samples/french-horn/",
}).toDestination();

// export tone object sampler for drums
export const drums = new toneObject.Sampler({
    urls: {
        "A3": "drums1.mp3",
        "B3": "drums2.mp3",
        "C3" : "drums3.mp3",
        "D3" : "drums4.mp3",
        "E3" : "drums5.mp3",
        "F3" : "drums6.mp3",
        "G3" : "drums7.mp3"
        // Add more violin notes as needed
    },
    release: 1,
    baseUrl: "/samples/drums/",
}).toDestination();