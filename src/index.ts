import app from './app'; //importa app desde app.ts

import {inicializeDatabase} from './db/conexion'; 
//importa la función inicializeDatabase

const port = 6505; //indica que puerto vamos a usar

async function main(){
    try{
       await inicializeDatabase();//utiliza la funcion incializeDatabase()
        console.log('Base de datos conectada');

        app.listen(6505, () => {
            console.log(`Servidor activo en el puerto ${port}`)
        });
    }catch(err:unknown){
        if(err instanceof Error){
            console.log('Error al conectar con la base de datos:',err.message);
        }
    }
}

main();