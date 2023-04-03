import axios from 'axios';
const LOG_API = "https://phishing-backend-is4800.herokuapp.com/api/logs";

export const createInteraction = async (interaction) => {
 const response = await axios.post(LOG_API, interaction)
 return response.data;
}

export const findInteractions  = async () => {
 const response = await axios.get(LOG_API);
 const interactions = response.data;
 return interactions;
}
