import axios from 'axios';
const LOG_API = "https://is4800-services.herokuapp.com/api/users";

export const createUser = async (user) => {
 const response = await axios.post(LOG_API, user)
 return response.data;
}