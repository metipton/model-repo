import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://starforge-153cc.firebaseio.com/'
});

export default instance;
