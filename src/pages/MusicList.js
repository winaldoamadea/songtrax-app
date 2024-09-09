import React from "react";
import { Link } from "react-router-dom";
import Template from "../components/Template";
import {useEffect, useState } from 'react';
import { getAllSamples } from "../api/api";
import {toneGuitarPart, tonePianoPart , toneFrenchPart, toneDrumsPart, toneObject, toneTransport} from "../data/instruments.js";


/**
 * Function to represent a React component for playing a music sample.
 *
 * @param {Object} toneObject tone js object to control the instrument
 * @param {Object} toneTransport tone.js for the timing
 * @param {string} tonePart selected tone instrument
 * @param {string} recData A string containing recording data in JSON format.
 * @param {boolean} isPreviewing a boolean to know whether it is previewing or not
 * @param {function} setIsPreviewing function to set the previewing state
 * @return {JSX.Element} - Returns a React component rendering a Preview button.
 */

function Sequencer({ toneObject, toneTransport, tonePart, recData , isPreviewing, setIsPreviewing }) {

    const instrumentData = {
        "guitar" : toneGuitarPart,
        "piano" : tonePianoPart,
        "frenchHorn" : toneFrenchPart,
        "drums" : toneDrumsPart,
    }

    const instrument = instrumentData[tonePart];

    // console.log(recData)
    const dictSong = {
        "A" : "A3",
        "B" : "B3",
        "C" : "C3",
        "D" : "D3",
        "E" : "E3",
        "F" : "F3",
        "G" : "G3",
    }
    const dict = {}

    for ( var i = 0 ; i <= 15; i++){
        dict[i] = []
    }

    (JSON.parse(recData)).forEach((note) => {
        for (const key in note){
            const listPlay = note[key]
            listPlay.forEach((play,index) => {
                if(play){
                dict[index].push(key)
                }
            })   
        }
    });

    const initialPreviewing = false;
    const [previewing, setPreviewing] = useState(initialPreviewing);
    useEffect(() => {

        instrument.clear();
        toneTransport.cancel();

        if (!isPreviewing) {
            setIsPreviewing(true); 
        }

        for (const key in dict){
            const play = dict[key]
            play.forEach((note) => {
                instrument.add((key + 1 - 1) / 16, dictSong[note]); 
            })   
        }

        toneTransport.schedule(time => {
            setPreviewing(false);
            setIsPreviewing(false);
            console.log("Preview stopped automatically.");
        }, 16/2);
    });

    return (
        <>
            <Preview previewing={previewing} setPreviewing={setPreviewing} toneObject={toneObject} toneTransport={toneTransport} setIsPreviewing={setIsPreviewing} isPreviewing={isPreviewing} dict = {dict} />
        </>
    );
}

/**
 * function to preview the song
 * @param {boolean} previewing a boolean to know whether it is previewing or not
 * @param {function} setPreviewing function to set the previewing state
 * @param {Object} toneObject tone js object to control the instrument
 * @param {Object} toneTransport tone.js for the timing
 * @param {function} setIsPreviewing function to set the previewing state
 * @param {Object} dict a dictionary containing the notes and the time they are played
 * @return {JSX.Element} - Returns a React component rendering a Preview button.
 */

function Preview({ previewing, setPreviewing, toneObject, toneTransport , setIsPreviewing, dict}) {

    function handleButtonClick() {

        toneObject.start();
        toneTransport.stop();

        if(previewing) {
            setIsPreviewing(false)
            setPreviewing(false);

        }
        else {
            setPreviewing(true);
            setIsPreviewing(true);
            toneTransport.start();
        }
    }
    return <a onClick={handleButtonClick}>{"Preview"}</a>;
}

const HomePage = () => {
    const [samples, setSamples] = useState([]);
    const [isLoading, setIsLoading] = useState(true);  // Added state for loading
    const [isPreviewing, setIsPreviewing] = useState(false);
  
    useEffect(() => {
      const fetchSamples = async () => {
        setIsLoading(true);  // Start loading
        const data = await getAllSamples();
        setSamples(data);
        setIsLoading(false);  // End loading
      };
      fetchSamples();
    }, []);
    return (
        <Template title="Music List">
            <main>
                <h2 class="title">Your Song Samples</h2>
                {isLoading ? (  // Conditional rendering based on loading state
        <p>Loading...</p>
      ) : (
        samples.map((sample) =>
                <section class="sample">
                    <div class="card">
                        <div class="song-details">
                            <h3>{sample.name}</h3>
                            <p>{sample.datetime}</p>
                        </div>
                        <div class="button-group-container">
                            <Link to={`/share/${sample.id}`}>Share</Link>
                            <Sequencer toneObject={toneObject} toneTransport={toneTransport} tonePart={sample.type} recData={sample.recording_data} isPreviewing={isPreviewing} setIsPreviewing={setIsPreviewing}  />
                            <Link to={`/edit/${sample.id}`} class="bright-button">Edit</Link>
                        </div>
                    </div>
                </section>)
      )}
                <div class="create-card">
                    <Link to={"/edit/new"} className="full-button">Create Sample</Link>
                </div>
            </main>
        </Template>
    );
}

export default HomePage;
