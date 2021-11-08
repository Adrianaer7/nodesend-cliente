import { 
    REGISTRO_ERROR,
    REGISTRO_EXITOSO,
    OCULTAR_ALERTA,
    LOGIN_ERROR,
    LOGIN_EXITOSO,
    USUARIO_AUTENTICADO,
    CERRAR_SESION
} from "../../types";

export default function pepe(state, action) {
    switch(action.type) {
        case REGISTRO_EXITOSO:
        case REGISTRO_ERROR:
        case LOGIN_ERROR:
            return {
                ...state,
                mensaje: action.payload
            }
        case OCULTAR_ALERTA:
            return {
                ...state,
                mensaje: null
            }
        case LOGIN_EXITOSO:
            localStorage.setItem("token", action.payload)
            return {
                ...state,
                token: action.payload,
                autenticado: true
            }
        case USUARIO_AUTENTICADO:
            return {
                ...state,
                usuario: action.payload,
                autenticado: true
            }
        case CERRAR_SESION:
            localStorage.removeItem("token")
            return {
                usuario: null,
                token: null,
                autenticado: null
            }

        default:
            return state;
    }
}