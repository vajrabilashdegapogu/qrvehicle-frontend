// import axios from "axios";

// export default axios.create({
//   baseURL: "https://qrvehicle-backend-production.up.railway.app/api"
// });

import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api"
});

export default api;