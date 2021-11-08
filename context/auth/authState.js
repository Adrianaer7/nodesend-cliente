import React, {useReducer} from 'react';
import authContext from './authContext';
import authReducer from "./authReducer"
import clienteAxios from "../../config/axios"
import tokenAuth from '../../config/tokenAuth';
import { 
    REGISTRO_EXITOSO,
    REGISTRO_ERROR,
    OCULTAR_ALERTA,
    LOGIN_ERROR,
    LOGIN_EXITOSO,
    USUARIO_AUTENTICADO,
    CERRAR_SESION
} from '../../types'; 

const AuthState = props => {
    //Definir un state inicial
    const initialState = {
        token: typeof window !== "undefined" ? localStorage.getItem("token") : "",  //una vez que me logeo, al recargar la pagina, el token del state inicia con el valor del token que hay en localstorage
        autenticado: null,
        usuario: null,
        mensaje: null
    }

    //Definir el reducer
    const [state, dispatch] = useReducer(authReducer, initialState)

    //Registrar nurvos usuarios
    const registrarUsuario = async datos => {   //la uso en crear-cuenta.js
        try {
            const respuesta = await clienteAxios.post("/api/usuarios", datos)
            dispatch({
                type: REGISTRO_EXITOSO,
                payload: respuesta.data.msg
            })
        } catch (error) {
            dispatch({
                type: REGISTRO_ERROR,
                payload: error.response.data.msg
            })
        }

        //Limpia la alerta despues de 3s
        setTimeout(() => {
            dispatch({
                type: OCULTAR_ALERTA,
            })
        }, 3000);
    }


    //Autenticar usuario
    const iniciarSesion = async datos => {  //la uso en login.js
        try {
            const respuesta = await clienteAxios.post("/api/auth", datos)   //envio los datos para que me cree un token
            dispatch({
                type: LOGIN_EXITOSO,
                payload: respuesta.data.token
            }) 
        } catch (error) {
            dispatch({
                type: LOGIN_ERROR,
                payload: error.response.data.msg
            })
        }

        //Limpia la alerta despues de 3s
        setTimeout(() => {
            dispatch({
                type: OCULTAR_ALERTA,
            })
        }, 3000);
    }

    //Retorna el Usuario autenticado en base al JWT
    const usuarioAutenticado = async () => {    //la uso en index.js
        const token = localStorage.getItem("token") //si ya inicie sesion, tomo el token del localstorage
        if(token) {
            tokenAuth(token)    //le envio el token a la funcion. Esta funcion manda el token por headers
        }

        try {
            //para hacer esta peticion get, necesito estar autenticado
            const respuesta = await clienteAxios.get("/api/auth")   //el middleware del backend se ejecuta, descifra el token que viene por headers, envia los datos del usuario al authController y este los muestra
            if(respuesta.data.usuario) {
                dispatch({
                    type: USUARIO_AUTENTICADO,
                    payload: respuesta.data.usuario
                })
            }
        } catch (error) {
            dispatch({
                type: LOGIN_ERROR,
                payload: error.response.data.msg
            })
        }
    }

    //Cerrar la sesion
    const cerrarSesion = () => {    //lo uso en Header.js
        dispatch({
            type: CERRAR_SESION,
        })
    }


    return ( 
        <authContext.Provider
            value={{
                token: state.token,
                autenticado: state.autenticado,
                usuario: state.usuario,
                mensaje: state.mensaje,
                registrarUsuario,
                iniciarSesion,
                usuarioAutenticado,
                cerrarSesion,
            }}
        >
            {props.children}
        </authContext.Provider>
     );
}
 
export default AuthState;