import React from "react";
import Template from "../components/Template";
import { useState, useEffect } from "react";
import { guitar, piano, frenchHorn, drums, toneGuitarPart, tonePianoPart , toneFrenchPart, toneDrumsPart} from "../data/instruments.js";
import { toneObject, toneTransport  } from "../data/instruments.js";
import { useParams, useNavigate } from "react-router-dom";
import { getSongById, createSong, updateSong } from '../api/api';


/**
 * Function to represent a React component for playing a music sample.
 * 
 * @param {str} selectedInstrument - the selected instrument
 * @param {function} setSelectedInstrument - function to set the selected instrument
 * @param {object} song - the song object
 * @param {function} setSong - function to set the song object
 * @param {function} setInstrumentData - function to set the instrument data
 *  
 * @return {JSX.Element} - Returns a React component rendering a Preview button.
*/

function SelectMusic({selectedInstrument , setSelectedInstrument, song, setSong, setInstrumentData}){

    const instrumentDatas = {
        "guitar" : toneGuitarPart,
        "piano" : tonePianoPart,
        "frenchHorn" : toneFrenchPart,
        "drums" : toneDrumsPart,
    }

    const handleInstrumentClick = (instrument,strInstrument) => {
        setSelectedInstrument(instrument);
        setInstrumentData(instrumentDatas[strInstrument])
        
        setSong({...song, type: strInstrument})
      };
      
    return (
    <div className="sequence-row-container">
      <button
        className={selectedInstrument === "guitar" || selectedInstrument === guitar ? 'toggle-selected' : 'toggle'}
        onClick={() => handleInstrumentClick(guitar,"guitar")}
      >
        Guitar
      </button>
      <button
        className={selectedInstrument === "piano" || selectedInstrument === piano ? 'toggle-selected' : 'toggle'}
        onClick={() => handleInstrumentClick(piano,"piano")}
      >
        Piano
      </button>
      <button
        className={selectedInstrument === "frenchHorn" || selectedInstrument === frenchHorn  ? 'toggle-selected' : 'toggle'}
        onClick={() => handleInstrumentClick(frenchHorn, "frenchHorn")}
      >
        French Horn
      </button>
      <button
        className={selectedInstrument === "drums" || selectedInstrument === drums ? 'toggle-selected' : 'toggle'}
        onClick={() => handleInstrumentClick(drums, "drums")}
      >
        Drums
      </button>
    </div>
    );
}

/**
 * Function to represent the button for choosing the bar note
 * 
 * @param {str} barID - the bar id
 * @param {boolean} barEnabled - the bar enabled
 * @param {function} handleBarClick - function to handle the bar click
 *  
 * @return {JSX.Element} - Returns a React component rendering a bar button.
 *  
 */

function Bar({ barID, barEnabled, handleBarClick }) {

    function barSelected() {
        if (barEnabled) {
            return "toggle-selected";
        }
        return "toggle";
    }

    return (
        <button className={` toggle bar-${barID} ${barSelected()}`} onClick={handleBarClick}></button>
    );

}

/**
 * function to sort the note and filtered the note to know which note is enabled
 * 
 * @param {object} sequence - the sequence object
 * @param {function} setSequence - function to set the sequence object
 * @param {obj} toneObject - the tone object
 * @param {obj} toneSound - the tone sound
 * @param {obj} instrument - the instrument
 * @param {obj} toneTransport - the tone transport
 * @param {function} setPreviewing - function to set the previewing state
 * 
 * @return {JSX.Element} - Returns a React component rendering a bar button.
 */

function Bars({ sequence, setSequence, toneObject , toneSound, instrument, toneTransport, setPreviewing}) {

    /**
     * This function is used to sort bar objects based on their barID.
     *
     * @param {object} bar - The first bar object to compare.
     * @param {object} otherBar - The second bar object to compare.
     * @return {number} - Returns -1 if the first bar's barID is less than the second bar's barID,
     * 1 if it's greater, and 0 if they are equal.
     */

    function sortSequence(bar, otherBar) {
        if (bar.barID < otherBar.barID) {
            return -1;
        }
        if (bar.barID > otherBar.barID) {
            return 1;
        }
        return 0;
    }

    /**
     * This function handles a click event on a bar element.
     *
     * @param {object} bar - The bar object representing the clicked bar.
     */

    function handleBarClick(bar) {
        toneObject.start();
        toneTransport.stop();
        const now = toneObject.now();
        instrument.triggerAttackRelease(toneSound, "8n", now);
        let filteredSequence = sequence.filter((_bar) => _bar.barID !== bar.barID);
        setSequence([ ...filteredSequence, { ...bar, barEnabled: !bar.barEnabled } ]);
        setPreviewing(false);
        
    }

    
    const sortedSequence = sequence.sort(sortSequence).map(bar => <Bar key={bar.barID} {...bar} handleBarClick={() => handleBarClick(bar)} />);
    return sortedSequence;

}


/**
 * This component handles the logic for starting and stopping the instrument preview.
 *
 * @param {boolean} previewing a boolean to know whether it is previewing or not
 * @param {function} setPreviewing function to set the previewing state
 * @param {Object} toneObject tone js object to control the instrument
 * @param {Object} toneTransport tone.js for the timing
 *
 * @return {JSX.Element} - Returns a React component rendering a "Preview" button.
 */

function Preview({ previewing, setPreviewing, toneTransport, toneObject}) {

    function handleButtonClick() {
        toneObject.start();
        toneTransport.stop();

        if(!previewing) {
            setPreviewing(true)
            toneTransport.start();
        }
        else {
            setPreviewing(false)

        }

    }
    return <button onClick={handleButtonClick}>{previewing ? "Preview" : "Preview"}</button>;
}

/**
 * Function to represent a React component for playing a music sample.
 *
 * @param {Object} toneObject tone js object to control the instrument
 * @param {Object} toneTransport tone.js for the timing
 * @param {Object} musicObj the instrument object
 * @param {Object} dicts the dictionary object
 * @param {function} setnewData function to set the new data
 * @param {Object} instrumentData the instrument data
 * @return {JSX.Element} - Returns a React component rendering a Preview button.
 */

function Sequencer({ toneObject, toneTransport, musicObj , dicts, setnewData, instrumentData }) {

    const initialSequence = {
    };

    const noteDatas = {}

    const noteDict = {}
    
    const notes = ['B','A','G','F','E','D','C']

    for ( var i = 0 ; i <= 16; i++){
        noteDict[i] = []
    }
    
    notes.forEach((notes) => {
        initialSequence[notes] = []
        noteDatas[notes] = []
    })

    const togglePreviewing = () => {
        setPreviewing((prevPreviewing) => !prevPreviewing);
    };

    if (dicts.recording_data != ''){
        const parseRec = JSON.parse(dicts.recording_data)

        parseRec.forEach((note) => {
            for (const key in note) {
                const bars = note[key];
                bars.forEach((bar, index) => {
                    initialSequence[key].push({
                        barID: index,
                        barEnabled: bar,
                    });
                });
            }
        });
        }

    else{
        notes.forEach((notes) => {
            for(let bar = 1; bar <= 16; bar++) {
                initialSequence[notes].push({
                    barID: bar,
                    barEnabled: false,
                });
                }

            }
        )
    }

    const [sequenceB, setSequenceB] = useState(initialSequence["B"]);
    const [sequenceA, setSequenceA] = useState(initialSequence['A']);
    const [sequenceG, setSequenceG] = useState(initialSequence['G']);
    const [sequenceF, setSequenceF] = useState(initialSequence['F']);
    const [sequenceE, setSequenceE] = useState(initialSequence['E']);
    const [sequenceD, setSequenceD] = useState(initialSequence['D']);
    const [sequenceC, setSequenceC] = useState(initialSequence['C']);


    const initialPreviewing = false;
    const [previewing, setPreviewing] = useState(initialPreviewing);

    sequenceB.forEach((obj) => {
        if (obj.barEnabled){
            noteDict[obj.barID].push("B3")
        }
    })

    sequenceA.forEach((obj) => {
        if (obj.barEnabled){
            noteDict[obj.barID].push("A3")
        }
    })

    sequenceG.forEach((obj) => {
        if (obj.barEnabled){
            noteDict[obj.barID].push("G3")
        }
    })

    sequenceF.forEach((obj) => {
        if (obj.barEnabled){
            noteDict[obj.barID].push("F3")
        }
    })

    sequenceE.forEach((obj) => {
        if (obj.barEnabled){
            noteDict[obj.barID].push("E3")
        }
    })

    sequenceD.forEach((obj) => {
        if (obj.barEnabled){
            noteDict[obj.barID].push("D3")
        }
    })

    sequenceC.forEach((obj) => {
        if (obj.barEnabled){
            noteDict[obj.barID].push("C3")
        }
    })


    useEffect(() => {

        sequenceA.forEach((obj) => noteDatas["A"].push(obj.barEnabled));
        sequenceB.forEach((obj) => noteDatas["B"].push(obj.barEnabled));
        sequenceC.forEach((obj) => noteDatas["C"].push(obj.barEnabled));
        sequenceD.forEach((obj) => noteDatas["D"].push(obj.barEnabled));
        sequenceE.forEach((obj) => noteDatas["E"].push(obj.barEnabled));
        sequenceF.forEach((obj) => noteDatas["F"].push(obj.barEnabled));
        sequenceG.forEach((obj) => noteDatas["G"].push(obj.barEnabled));

        setnewData(JSON.stringify(noteDatas))

        instrumentData.clear()
        toneTransport.cancel();
        for (const key in noteDict){
            const play = noteDict[key]
            if (play.length > 0){
            play.forEach((note) => {
                if (note!= NaN)
                instrumentData.add((key + 1 - 1) / 16, note);
            })}
        }

        toneTransport.schedule(time => {
            setPreviewing(true);
        }, 16/8);


    });

    return (
        <>
        <div class="toggle-row-container">
           <div class="row-label">
                        <h4>B</h4>
            </div>
            <div class="sequence-row-container">
                <Bars sequence={sequenceB} setSequence={setSequenceB} toneSound = "B3" toneObject={toneObject} instrument={musicObj} toneTransport={toneTransport} setPreviewing={setPreviewing}/>
            </div>
            </div>
            <div class="toggle-row-container">
           <div class="row-label">
                        <h4>A</h4>
        </div>
            <div class="sequence-row-container">
                <Bars sequence={sequenceA} setSequence={setSequenceA} toneSound ="A3" toneObject={toneObject} instrument={musicObj} toneTransport={toneTransport}  setPreviewing={setPreviewing} />
            </div>
            </div>
            <div class="toggle-row-container">
           <div class="row-label">
                        <h4>G</h4>
        </div>
            <div class="sequence-row-container">
                <Bars sequence={sequenceG} setSequence={setSequenceG} toneSound = "G3" toneObject={toneObject} instrument={musicObj} toneTransport={toneTransport} setPreviewing={setPreviewing}/>
            </div>
            </div>
            <div class="toggle-row-container">
           <div class="row-label">
                        <h4>F</h4>
        </div>
            <div class="sequence-row-container">
                <Bars sequence={sequenceF} setSequence={setSequenceF} toneSound = "F3" toneObject={toneObject} instrument={musicObj} toneTransport={toneTransport} setPreviewing={setPreviewing} />
            </div>
            </div>
            <div class="toggle-row-container">
           <div class="row-label">
                        <h4>E</h4>
        </div>
            <div class="sequence-row-container">
                <Bars sequence={sequenceE} setSequence={setSequenceE} toneSound = "E3" toneObject={toneObject} instrument={musicObj} toneTransport={toneTransport} setPreviewing={setPreviewing}/>
            </div>
            </div>
            <div class="toggle-row-container">
           <div class="row-label">
                        <h4>D</h4>
        </div>
            <div class="sequence-row-container">
                <Bars sequence={sequenceD} setSequence={setSequenceD} toneSound = "D3" toneObject={toneObject} instrument={musicObj} toneTransport={toneTransport}  setPreviewing={setPreviewing} />
            </div>
            </div>
            <div class="toggle-row-container">
           <div class="row-label">
                        <h4>C</h4>
        </div>
            <div class="sequence-row-container">
                <Bars sequence={sequenceC} setSequence={setSequenceC} toneSound = "C3" toneObject={toneObject} instrument={musicObj} toneTransport={toneTransport} setPreviewing={setPreviewing}/>
            </div>
            </div>
            <p>
                <Preview previewing={previewing} setPreviewing={setPreviewing} toneObject={toneObject} toneTransport={toneTransport} togglePreviewing={togglePreviewing} />
            </p>

        </>
    );

}

/**
 * react component to render the others react component where it fetch the data from id back in music list if it is edit and create new id if it is new
 * 
 * @return {JSX.Element} - Returns a React component rendering a Preview button.
 * 
 */

export default function MusicList() {

    const [selectedInstrument, setSelectedInstrument] = useState(guitar);
    const [isSaving, setIsSaving] = useState(false);
    const handleInstrumentClick = (instrument) => { 
        setSelectedInstrument(instrument);
    }

    const dictioMusic = {guitar : guitar, piano: piano, frenchHorn: frenchHorn, drums: drums}

    const [instrumentData, setInstrumentData] = useState(toneGuitarPart);


    const instrumentDatas = {
        "guitar" : toneGuitarPart,
        "piano" : tonePianoPart,
        "frenchHorn" : toneFrenchPart,
        "drums" : toneDrumsPart,
    }

    const [song,setSong] = useState({ id : '', apikey: '', name: '' , recording_data: [],type:'guitar',datetime:''})
    const [newData, setnewData] = useState([])
    const { id } = useParams();

    const [isLoading, setIsLoading] = useState(false);  // Added state for loading
    useEffect(() => {

        if (id !== 'new') {
          const fetchSamples = async () => {
            const data = await getSongById(id);
            setIsLoading(true);
            setSong(data);
            setSelectedInstrument(dictioMusic[data.type])
            setInstrumentData(instrumentDatas[data.type])
            setIsLoading(false);
          };
          fetchSamples();
        }
      }, [id]);
    const history = useNavigate();
    const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);  // Set loading to true when save starts
    
    try {
        if (id === 'new'){
            // console.log(song,newData)
            const returnedJson = await createSong(song,newData);
            history(`/edit/${returnedJson.id}`);
        }else{
        await updateSong(id, song, newData);
         }
        }
    catch (error) {
        // Handle error appropriately
    } finally {
        setIsSaving(false);  // Set loading to false when save is complete
    }
    };
      return isLoading ? (
        <p>Loading...</p>
      ) : (        <Template title="Music List">
      <main>
      <h2 class="title">Your Song Samples</h2>
              <h2 class="title">Edit Sample:</h2>
              <form class="card edit-card" onSubmit={ handleSubmit }>
                  <input type="text" value={song.name} 
                  id="title"
                  onChange={(e) => setSong({ ...song, name:e.target.value })}
                  ></input>
                  <div class="button-group-container">
                  <button type="submit" class = "bright-button" disabled={isSaving}>
            {isSaving ? <div className="spinner"></div> : 'Save' }
        </button>
                  </div>
              </form>
              <div class="toggle-row-container">
                  <div class="row-label">
                      <h4>Instrument</h4>
                  </div>
              <SelectMusic instrumentData = {instrumentData} theSelectedInstrument = {handleInstrumentClick} setSelectedInstrument = {setSelectedInstrument} selectedInstrument = {selectedInstrument} setSong = {setSong} song = {song} setInstrumentData={setInstrumentData}> </SelectMusic>
              </div>
                  <Sequencer instrumentData = {instrumentData} toneObject = { toneObject } toneTransport = { toneTransport } musicObj = { selectedInstrument } dicts = { song } setnewData = { setnewData }/>
        </main>
    </Template>
      );    
}
