/**
 * Base URL for API requests.
 * 
 */
const APIKEY = 'h81hXF81OD';
const BASE_URL = 'https://comp2140.uqcloud.net/api/';

/**
 * Fetches all posts from the API.
 * @returns {Promise} - Promise resolving to an array of all posts.
 */
export const getAllSamples = async () => {
  const url = `${BASE_URL}sample/?api_key=${APIKEY}`;
  const response = await fetch(url);
  return response.json();
};

/**
 * Fetches a single post by ID.
 * @param {string} id - The ID of the song.
 * @returns {Promise} - Promise resolving to the post object.
 */
export const getSongById = async (id) => {
  const url = `${BASE_URL}sample/${id}/?api_key=${APIKEY}`;
  const response = await fetch(url);
  return response.json();
};

/**
 * Creates a new post.
 * @param {object} song - The song object 
 * @returns {Promise} - Promise resolving to the created post object.
 */
export const createSong = async (post,newData) => {
  const theData = "[" + newData + "]"
  const url = `${BASE_URL}sample/`;
  const data = {
    'type': post.type, 
    'name': post.name, 
    'recording_data': theData,
    'api_key': APIKEY,
 }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

/**
 * Deletes a post.
 * @param {string} id - The ID of the song to edit.
 * @param {object} song - The song object 
 * @returns {Promise} - Promise resolving to the updated post object.
 */

export const updateSong = async (id,post,newData) => {
  const url = `${BASE_URL}sample/${id}/?api_key=${APIKEY}`;
  const theData = "[" + newData + "]"
  const data = {
                  'type': post.type, 
                  'name': post.name, 
                  'recording_data': theData,
                  'api_key': APIKEY,
                  'id' : id,
                  'datetime' : post.datetime,
               }
  const response = await fetch(url, {
      method: "PUT",
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

  const json = await response.json();

return json;
  }

/**
 * function to get all location
 * @returns {Promise} - Promise resolving to an array of all locations.
 * 
*/

export const getAllLocation = async () => {
  const url = `${BASE_URL}location/?api_key=${APIKEY}`;
  const response = await fetch(url);
  return response.json();
};

/**
 * Creates a sample to location.
 * @param {str} loc_id - the location id.
 * @param {str} sam_id - the sample id.
 * @returns {Promise} - Promise resolving to the created sampletolocation object.
 */
export const createSampletoLocation = async (loc_id,sam_id) => {
  const url = `${BASE_URL}sampletolocation/`;
  const data = {
    'location_id': loc_id, 
    'sample_id': sam_id, 
    'api_key': APIKEY,}
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

/**
 * Fetches a single sampletolocation by ID.
 * @returns {Promise} - Promise resolving to the sampletolocation object
 */

export const getSampletoLocation = async () => {
  const url = `${BASE_URL}sampletolocation/?api_key=${APIKEY}`;
  const response = await fetch(url);
  return response.json();
}

/**
 * delete a single sampletolocatiion by ID.
 * @param {string} id - The ID of the sampletolocation
 */
export const deleteSampleToLocation = async (id) => {
  const url = `${BASE_URL}sampletolocation/${id}/?api_key=${APIKEY}`;
  const response = await fetch(url, {
    method: 'DELETE',
  });
}

