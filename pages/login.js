import React, { useContext, useEffect } from 'react';
import Layout from "../components/Layout";
import { useFormik } from 'formik';
import * as Yup from "yup"
import authContext from '../context/auth/authContext';
import Alerta from "../components/Alerta"
import router from 'next/router';

const Login = () => {

    //Acceder al state de AuthState
    const AuthContext = useContext(authContext)
    const {token, autenticado, mensaje, iniciarSesion} = AuthContext 

    //Para redireccionar si ya estoy logeado
    useEffect(() => {
        if(token) {
            router.push("/")
        }
        if(autenticado) {
            router.push("/")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[autenticado])

    //Formulario y validacion con Formik y Yup
    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema: Yup.object({  //aca vamos a tener un esquema de validacion, que va a ser un objeto de yup
            email: Yup.string().required("El email es obligatorio").email("El email no es valido"),
            password: Yup.string().required("La contraseña no puede ir vacía")
        }),
        onSubmit: valores => {  //el submit se va a ejecutar siempre y cuando se cumpla con la validacion de arriba
            iniciarSesion(valores)
        }
    })

  return ( 
    <Layout>
      <div className="md: w-4/5 xl:w-3/5 mx-auto mb-32">
        <h2 className="text-4xl font-sans font-bold text-gray-800 text-center">Iniciar sesion</h2>

        {mensaje && <Alerta/>}

        <div className="flex justify-center mt-5">
            <div className="w-full max-w-lg">
                <form 
                    className="bg-white rounded mx-auto shadow-md px-8 pt-6 pb-8 mb-4"
                    onSubmit={formik.handleSubmit}
                >
                    <div className="mb-4">
                        <label 
                            className="block text-black text-sm font-bold mb-2"
                            htmlFor="email"
                        >   Correo electronico
                        </label>
                        <input
                            type="email"
                            className="shadow-appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Email de usuario"
                            id="email" //tiene que ser igual al htmlFor para que cuando dé click en el label, se haga focus en el input
                            value={formik.values.email}    
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>
                    {formik.touched.email && formik.errors.email ? (  //si salgo el input vacio o si intento hacer submit, me muestra este error
                        <div className="my-2 bg-gray-200 border-l-4 border-red-500 text-red-700 p-4">
                            <p className="font-bold">Error</p>
                            <p>{formik.errors.email}</p>
                        </div>
                    ): null}

                    <div className="mb-4">
                        <label 
                            className="block text-black text-sm font-bold mb-2"
                            htmlFor="password"
                        >   Contraseña
                        </label>
                        <input
                            type="password"
                            className="shadow-appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Contraseña de usuario"
                            id="password" //tiene que ser igual al htmlFor para que cuando dé click en el label, se haga focus en el input
                            value={formik.values.password}    
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>
                    {formik.touched.password && formik.errors.password ? (  //si salgo el input vacio o si intento hacer submit, me muestra este error
                        <div className="my-2 bg-gray-200 border-l-4 border-red-500 text-red-700 p-4">
                            <p className="font-bold">Error</p>
                            <p>{formik.errors.password}</p>
                        </div>
                    ): null}

                    <input
                        type="submit"
                        className="bg-red-500 hover:bg-gray-900 w-full p-2 text-white uppercarse font-bold"
                        value="Iniciar sesion"
                    />
                </form>
            </div>
        </div>
      </div>
    </Layout>
   );
}
 
export default Login;