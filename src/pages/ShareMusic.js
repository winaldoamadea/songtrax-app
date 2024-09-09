import Template from "../components/Template";
import {toneGuitarPart, tonePianoPart , toneFrenchPart, toneDrumsPart, toneObject, toneTransport} from "../data/instruments.js";
import React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSongById , getAllLocation ,getSampletoLocation , createSampletoLocation, deleteSampleToLocation} from "../api/api";
/**
 * Function to represent a React component for playing a music sample.
 *
 * @param {Object} toneObject tone js object to control the instrument
 * @param {Object} toneTransport tone.js for the timing
 * @param {string} tonePart selected tone instrument
 * @param {string} recData A string containing recording data in JSON format.
 * @param {boolean} isPreviewing a boolean to know whether it is previewing or not
 * @param {function} setIsPreviewing function to set the previewing state
 *
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
 * This component handles the logic for starting and stopping the instrument preview.
 *
 * @param {boolean} previewing a boolean to know whether it is previewing or not
 * @param {function} setPreviewing function to set the previewing state
 * @param {Object} toneObject tone js object to control the instrument
 * @param {Object} toneTransport tone.js for the timing
 * @param {function} setIsPreviewing function to set the previewing state
 * @param {Object} dict a dictionary containing the notes to be played
 *
 * @return {JSX.Element} - Returns a React component rendering a "Preview" button.
 */
function Preview({ previewing, setPreviewing, toneObject, toneTransport , setIsPreviewing}) {

    function handleButtonClick() {

        toneObject.start();
        toneTransport.stop();

        if(previewing) {
            setIsPreviewing(false)
            setPreviewing(false);

        }else {
            setPreviewing(true);
            setIsPreviewing(true);
            console.log("Preview started.");
            toneTransport.start();
        }
    }
    return <a onClick={handleButtonClick}>{"Preview"}</a>;
}

/**
 * This function represents the main React component for sharing music.
 * It manages various states and handles user interactions related to sharing music samples.
 *
 * @return {JSX.Element} - Returns the main React component for sharing music.
 * This component displays music details, instrument controls, and allows users to share or unshare the sample with locations.
 */
export default function ShareMusic(){
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);  // Added state for loading
    const [isPreviewing, setIsPreviewing] = useState(false);
    const [song, setSong] = useState({});
    const [locsData, setlocsData] = useState();
    const { id } = useParams();
    const [location, setLocation] = useState([]); 
    useEffect(() => {

          const fetchSong = async () => {

            const data = await getSongById(id);
            const locs = await getAllLocation();
            const samplesLoc = await getSampletoLocation();

            const filteredSample = samplesLoc.filter((sample) => sample.sample_id == id ).flat();
            const filteredLocation = filteredSample
            .map((sample) => {
              const matchingLoc = locs.find((loc) => loc.id === sample.location_id);

              if (matchingLoc) {
                return matchingLoc.name;
              }
              return null; // Handle cases where no matching location is found
            })
            .filter((locationId) => locationId !== null);

            setlocsData(filteredLocation);
            setIsLoading(true);
            setLocation(locs);
            setSong(data);
            setIsLoading(false);
          };
          fetchSong();
          
      }, [id]);

      const history = useNavigate();
      async function handleButtonClick(locationId,locName) {
        setIsSaving(true);  // Set loading to true when save starts
        try {
          const response = await createSampletoLocation(locationId,id);
          if (!locsData.includes(locName)) {
            const newData = [...locsData, locName]; // Create a new array with the updated values
            setlocsData(newData); // Update the state with the new array
          }
          history(`/share/${id}`);
        }
        catch (error) {
            // Handle error appropriately
        } finally {
            setIsSaving(false);  // Set loading to false when save is complete
        }
        };
        async function handleButtonClick2(locationId, locName) {
          setIsSaving(true);  // Set loading to true when save starts
          try {
            const response = await getSampletoLocation();
            const filteredSamples = response.filter((sample) => sample.sample_id == id && sample.location_id == locationId).flat();
            await deleteSampleToLocation(filteredSamples[0].id);
            // Create a new array without the locName
            const newData = locsData.filter((location) => location !== locName);
            setlocsData(newData); // Update the state with the new array
            history(`/share/${id}`);
          } catch (error) {
            // Handle error appropriately
            console.log(error)
          } finally {
            setIsSaving(false);  // Set loading to false when save is complete
          }
        }
      
      return (
        <Template title="Music List">
          <main>
            <h2 className="title">Share This Sample</h2>
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <div>
                <div className="card">
                  <div className="song-details">
                    <h3>{song.name}</h3>
                    <h5>{song.date}</h5>
                  </div>
                  <div className="buttons">
                    <Sequencer
                      tonePart={song.type}
                      recData={song.recording_data}
                      toneObject={toneObject}
                      toneTransport={toneTransport}
                      isPreviewing={isPreviewing}
                      setIsPreviewing={setIsPreviewing}
                    />
                  </div>
                </div>
                {location.map((loc) => (
                  <div className="toggle-row-container" key={loc.id}>
                    <div className="location-name-label">
                      <h4>{loc.name}</h4>
                    </div>
                    <div className="sequence-row-container">
                      <button
                        className={locsData.includes(loc.name)  ? 'toggle-selected' : 'toggle'}
                        onClick={() => handleButtonClick(loc.id,loc.name)}
                      >
                        Shared
                      </button>
                      <button
                        className={!locsData.includes(loc.name) ? 'toggle-selected' : 'toggle'}
                        onClick={() => handleButtonClick2(loc.id,loc.name)}
                      >
                        Not Shared
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </Template>
      );
    }