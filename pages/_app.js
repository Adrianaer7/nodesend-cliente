//En next.js, el archivo que tenga un __ adelante de su nombre, significa que es el padre de todos los archivos
import React from 'react';
import AuthState from '../context/auth/authState';
import AppState from '../context/app/AppState';

const MyApp = ({Component, pageProps}) => {
  return ( 
    <AuthState>
      <AppState>
        <Component {...pageProps}/>
      </AppState>
    </AuthState>
   );
}
 
export default MyApp;