import React, { useReducer } from 'react';
import appContext from "./appContext"
import appReducer from "./appReducer"
import clienteAxios from '../../config/axios';
import { 
    MOSTRAR_ALERTA,
    OCULTAR_ALERTA,
    SUBIR_ARCHIVO,
    SUBIR_ARCHIVO_EXITO,
    SUBIR_ARCHIVO_ERROR,
    AGREGAR_PASSWORD,
    AGREGAR_DESCARGAS,
    CREAR_ENLACE_EXITO,
    LIMPIAR_STATE
} from "../../types";

const AppState = props => {
    //state
    const initialState = {
        mensaje_archivo: null,  //lo uso en index y en alerta.js
        nombre: "",
        nombre_original: "",
        cargando: true,
        descargas: 1,
        password: "",
        autor: null,
        url: "",
    }

    //crear reducer
    const [state, dispatch] = useReducer(appReducer, initialState)

    //Muestra una alerta
    const mostrarAlerta = msg => {  //se ejecuta en Dropzone.js y en [enlace].js
        dispatch({
            type: MOSTRAR_ALERTA,
            payload: msg
        })

        //Limpia la alerta despues de 3s
        setTimeout(() => {
            dispatch({
                type: OCULTAR_ALERTA,
            })
        }, 3000);
    }

    //Subir los archivos al servidor
    const subirArchivo = async (formData, nombreArchivo) => {   //Se ejecuta en Dropzone.js
        dispatch({
            type: SUBIR_ARCHIVO
        })
        try {
            const respuesta = await clienteAxios.post("/api/archivos", formData)
            dispatch({
                type: SUBIR_ARCHIVO_EXITO,
                payload: {
                    nombre: respuesta.data.archivo, //contiene el nombre del archivo hasheado con nanoid en el archivosController
                    nombre_original: nombreArchivo
                }
            })
        } catch (error) {
            dispatch({
                type: SUBIR_ARCHIVO_ERROR,
                payload: error.response.data.msg
            })
        }
    }

    //crea un enlace una vez que se subio el archivo
    const crearEnlace = async () => {   //se ejecuta en Dropzone.js
        const data = {
            nombre: state.nombre,
            nombre_original: state.nombre_original,
            descargas: state.descargas,
            password: state.password,
            autor: state.autor,
        }
        try {
            const respuesta = await clienteAxios.post("/api/enlaces", data)
            dispatch({
                type: CREAR_ENLACE_EXITO,
                payload: respuesta.data.url
            })
        } catch (error) {
            console.error(error)
        }
    }

    const limpiarState = () => {    //se ejecuta en Header.js
        dispatch({
            type: LIMPIAR_STATE
        })
    }

    //Agrega contraseña
    const agregarPassword = password => { // la uso en formulario.js
        dispatch({
            type: AGREGAR_PASSWORD,
            payload: password
        })
    }

    //Agregar cantidad de descargas
    const agregarDescargas = descargas => { //la uso en formulario.js
        dispatch({
            type: AGREGAR_DESCARGAS,
            payload: descargas
        })
    }

    return ( 
        <appContext.Provider
            value={{
                mensaje_archivo: state.mensaje_archivo,
                nombre: state.nombre,
                nombre_original: state.nombre_original,
                cargando: state.cargando,
                descargas: state.descargas,
                password: state.password,
                autor: state.autor,
                url: state.url,
                mostrarAlerta,
                subirArchivo,
                crearEnlace,
                limpiarState,
                agregarPassword,
                agregarDescargas
            }}
        >
            {props.children}
        </appContext.Provider>
     );
}
 
export default AppState;