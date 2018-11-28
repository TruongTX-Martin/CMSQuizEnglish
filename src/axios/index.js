import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://quizenglishlistening.firebaseio.com/'
})
instance.defaults.crossDomain = true;

export default instance;