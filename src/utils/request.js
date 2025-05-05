import axios from 'axios' // 引入axios

const service = axios.create({
  // baseURL: import.meta.env.VITE_BASE_API,
  baseURL: "http://localhost:8989/",
  timeout: 99999
})

export default service
