import axios from 'axios';
const LOG_API = "https://phishing-backend-is4800.herokuapp.com/api/users";

export const createUser = async (user) => {
 const response = await axios.post(LOG_API, user)
 return response.data;
}