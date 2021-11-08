import axios from "axios"

const clienteAxios = axios.create({
    baseURL: process.env.backendURL //backendURL viene del archivo next.config.js
})

export default clienteAxios;