import axios from "axios";

axios;
axios.defaults.withCredentials = true;

const instance = axios.create({
  baseURL: process.env.SERVER_BASE_URL || "http://localhost:7080",
});

export default instance;
