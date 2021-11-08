import React, {useEffect, useContext} from 'react';
import Link from "next/link"
import authContext from '../context/auth/authContext';
import appContext from "../context/app/appContext"
import router from 'next/router';
import Image from "next/image"

const Header = () => {
    //Extraer el Usuario autenticado del Storage
    const AuthContext = useContext(authContext)
    const {usuario, cerrarSesion} = AuthContext

    //Context de la aplicacion
    const AppContext = useContext(appContext)
    const {limpiarState} = AppContext

    const redireccionar = () => {
        router.push("/")
        limpiarState()
    }

    return ( 
        <header className="py-8 flex flex-col md:flex-row items-center justify-between">
                <Image
                    src="/logo.svg"
                    alt="logo"
                    height="100"
                    width="260"
                    className="w-64 mb-8 md:mb-0 cursor-pointer"
                    onClick={() => redireccionar()}
                />
            <div>
                {usuario 
                    ?(  <div className="flex items-center">
                            <p className="mr-2">Hola, <span className="font-bold">{usuario.nombre}</span></p>
                            <button 
                                className="bg-red-500 mr-2 px-5 py-3 rounded-lg text-white font-bold uppercase"
                                onClick={() => cerrarSesion()}
                            >Cerrar sesion</button>
                        </div>
                    )
                    :(  <>
                            <Link href="/login">
                                <a className="bg-red-500 mr-2 px-5 py-3 rounded-lg text-white font-bold uppercase">Iniciar sesion</a>
                            </Link>
                            <Link href="/crear-cuenta">
                                <a className="bg-black px-5 py-3 rounded-lg text-white font-bold uppercase">Crear cuenta</a>
                            </Link>
                        </>
                    )    
                } 
            </div>
        </header>
     );
}
 
export default Header;