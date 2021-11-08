import React, {useState, useContext, useEffect} from 'react';
import Layout from "../../components/Layout"
import clienteAxios from "../../config/axios"
import appContext from "../../context/app/appContext"
import authContext from "../../context/auth/authContext"
import Alerta from "../../components/Alerta"

export async function getServerSidePaths() { 
    const enlaces = await clienteAxios.get("/api/enlaces")  //obtengo el objeto con todos los enlaces creados
    return {
        paths: enlaces.data.enlaces.map(enlace => ({    //Itero sobre cada uno de los enlaces y creo la url. paths son las rutas. enlaces.data.enlaces porque es la respuesta de axios
            params: {enlace: enlace.url}    //params son los datos que le paso por la barra de direcciones. enlace porque este archivo se llama enlace.js. enlace.url porque accede al campo url del objeto
        })),
        fallback: false //esto permite que se visiten solo las url validas, sino, se muestra un page 404 not found 
    }
}

export async function getServerSideProps({params}) {
    const {enlace} = params    //extraigo el params que viene del return del getStaticPatch. Contiene el nombre de todos los enlaces
    const resultado = await clienteAxios.get(`/api/enlaces/${enlace}`) //resultado va a contener el nombre del archivo
    return {
        props: {    //como el nombre de la funcion lo indica, tengo que retornar los props
            enlace: resultado.data  //el prop enlace va a contener el nombre del archivo, si tiene password, y la url
        }
    }
}


const Enlace = ({enlace}) => {  //importo enlace del getStaticProps 

    //Extraer context de la app
    const AppContext = useContext(appContext)
    const {mostrarAlerta, mensaje_archivo} = AppContext

    //Extraer el Usuario autenticado del Storage
    const AuthContext = useContext(authContext)
    const {usuarioAutenticado} = AuthContext

    const [tienePassword, setTienePassword] = useState(enlace.password) //el state empieza con el password:true del enlaceController
    const [password, setPassword] = useState("")    //se va colocando la password que escribo

    useEffect(() => {
        usuarioAutenticado()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const verificarPassword = async e => {
        e.preventDefault()

        const data = {
            password    //tomo la password del state
        }

        try {
            const resultado = await clienteAxios.post(`/api/enlaces/${enlace.enlace}`, data)
            setTienePassword(resultado.data.password)
        } catch (error) {
            mostrarAlerta(error.response.data.msg)
        }
    }

    return (
        <Layout>
            {tienePassword 
                ? (
                    <>
                        <p className="text-center">Este enlace está protegido con clave, por favor, ingrésalo debajo:</p>
                        {mensaje_archivo && <Alerta/>}
                        <div className="flex justify-center mt-5">

                            <div className="w-full max-w-lg">
                                <form 
                                    className="bg-white rounded mx-auto shadow-md px-8 pt-6 pb-8 mb-4"
                                    onSubmit={e => verificarPassword(e)}
                                >
                                    <div className="mb-4">
                                        <label 
                                            className="block text-black text-sm font-bold mb-2"
                                            htmlFor="password"
                                        >   Contraseña
                                        </label>
                                        <input
                                            type="password"
                                            className="shadow-appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            placeholder="Contraseña del enlace"
                                            id="password" //tiene que ser igual al htmlFor para que cuando dé click en el label, se haga focus en el input
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                        />
                                    </div>
                                    <input
                                        type="submit"
                                        className="bg-red-500 hover:bg-gray-900 w-full p-2 text-white uppercarse font-bold"
                                        value="Validar contraseña"
                                    />
                                    
                                </form>
                            </div>
                        </div>
                    </>
                )
                :(
                    <>
                        <h1 className="text-4xl text-center text-gray-700">Descargá tu archivo:</h1>
                        <div className="flex items-center justify-center mt-10">
                            <a 
                                href={`${process.env.backendURL}/api/archivos/${enlace.archivo}`}   //le paso el nombre del archivo. Habilito el acceso al archivo en el index.js del backend
                                className="bg-red-500 text-center px-10 py-3 rounded uppercase font-bold text-white cursor-pointer"
                                download
                            >
                                Acá
                            </a>
                        </div>
                    </>
                )
            }
        </Layout>
    )
}

export default Enlace;