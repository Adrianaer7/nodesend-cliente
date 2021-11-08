import React, {useContext} from 'react';
import appContext from '../context/app/appContext';
import authContext from '../context/auth/authContext';

const Alerta = () => {

    //Extraer msj de error para Usuarios
    const AuthContext = useContext(authContext)
    const {mensaje} = AuthContext

    //Extraer msj de error para Archivos
    const AppContext = useContext(appContext)
    const {mensaje_archivo} = AppContext
    return ( 
        <div className="bg-red-500 py-2 px-3 w-full my-3 max-w-lg text-center text-white mx-auto">
            {mensaje || mensaje_archivo}   {/*muestra un mensaje u otro segun de la ocasion */}
        </div>
     );
}
 
export default Alerta;