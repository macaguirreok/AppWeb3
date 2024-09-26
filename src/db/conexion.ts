import { DataSource } from "typeorm"; //importa clase de type orm
import { createConnection } from "mysql2/promise"; //para conexiones con promesas de mysql
import {Estudiante} from "../models/estudianteModel";
import {Curso} from "../models/cursoModel";
import {Profesor} from "../models/profesorModel";
import { CursoEstudiante} from "../models/inscripcionModel";
//importa los modelos de las entidades q representan las tablas de la bd

async function createDatabaseIfNotExists(){ //crear bd si no existe
    const connection = await createConnection({ //crear la conexion a la bd
        host:"localhost",
        port:3306,
        user:"root",
        password:"",
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS universidad_maqui`);
    await connection.end();
} //hasta acá es para crear la bd si es q no existe

export const AppDataSource = new DataSource({
type:"mysql",
host:"localhost",
username:"root",
password:"",
database:"universidad_maqui",
entities:[Estudiante, Curso, Profesor, CursoEstudiante],
synchronize:false, //lo puse en falso porque sino me crea la bd de nuevo
logging:true
}); //crear la conexión con la bd cada vez, 
//utilizado en los controllers

export async function inicializeDatabase(){
    await createDatabaseIfNotExists();
    await AppDataSource.initialize();
}