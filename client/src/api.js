import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 0,
  headers: {
    Accept: "application/vnd.GitHub.v3+json",
  },
});

export { http };
