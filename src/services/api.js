import axios from "axios";

const api = axios.create({
  baseURL: "https://api.owntag.in/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json"
  }
});

export default api;