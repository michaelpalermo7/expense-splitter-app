import axios from "axios";

const baseURL = import.meta.env.PROD ? "/api" : "http://localhost:8080/api";

export const api = axios.create({ baseURL });
