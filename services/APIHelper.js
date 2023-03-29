import axios from "axios";

axios;
axios.defaults.withCredentials = true;

const instance = axios.create({
  baseURL: "http://api:8082",
});

export default instance;
