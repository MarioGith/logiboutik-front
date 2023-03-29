import axios from "axios";

axios;
axios.defaults.withCredentials = true;

const instance = axios.create({
  baseURL: "http://localhost:8082",
});

export default instance;
