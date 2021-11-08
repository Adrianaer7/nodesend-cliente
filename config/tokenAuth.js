import clienteAxios from "./axios";

const tokenAuth = token => {
    if(token) { //si existe un token, lo envío a Authorization por headers, como en el backend con postman. Esto sirve para autenticarme 
        clienteAxios.defaults.headers.common["Authorization"] = `Bearer ${token}`
    } else {
        //si no existe el token, no permito al usuario que haga una peticion en donde se requiera un auth
        delete clienteAxios.defaults.headers.common["Authorization"]
        console.log(clienteAxios.defaults.headers.common)
    }
}
 
export default tokenAuth;