// frontend/src/api/client.ts
import axios from "axios";

const baseURL = import.meta.env.PROD ? "" : "http://localhost:8080";

export const api = axios.create({ baseURL });
