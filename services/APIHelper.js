import axios from "axios";

axios.defaults.withCredentials = true;

// Uses SERVER_BASE_URL (exposed via next.config.js) when set, and falls back to
// the local backend so existing local/single-machine setups keep working.
const instance = axios.create({
  baseURL: process.env.SERVER_BASE_URL || "http://localhost:8082",
});

export default instance;
