// import axios from "axios";

// export default axios.create({
//   baseURL: "http://localhost:8080/api"
// });

import axios from "axios";

const api = axios.create({
  // baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api"
  baseURL: "https://qrvehicle-backend-production.up.railway.app/api"
});

export default api;