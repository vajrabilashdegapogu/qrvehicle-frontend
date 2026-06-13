import axios from "axios";

export default axios.create({
  baseURL: "https://qrvehicle-backend-production.up.railway.app/api"
});