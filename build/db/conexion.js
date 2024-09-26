"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
exports.inicializeDatabase = inicializeDatabase;
const typeorm_1 = require("typeorm"); //importa clase de type orm
const promise_1 = require("mysql2/promise"); //para conexiones con promesas de mysql
const estudianteModel_1 = require("../models/estudianteModel");
const cursoModel_1 = require("../models/cursoModel");
const profesorModel_1 = require("../models/profesorModel");
const inscripcionModel_1 = require("../models/inscripcionModel");
//importa los modelos de las entidades q representan las tablas de la bd
function createDatabaseIfNotExists() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, promise_1.createConnection)({
            host: "localhost",
            port: 3306,
            user: "root",
            password: "",
        });
        yield connection.query(`CREATE DATABASE IF NOT EXISTS universidad_maqui`);
        yield connection.end();
    });
} //hasta acá es para crear la bd si es q no existe
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: "localhost",
    username: "root",
    password: "",
    database: "universidad_maqui",
    entities: [estudianteModel_1.Estudiante, cursoModel_1.Curso, profesorModel_1.Profesor, inscripcionModel_1.CursoEstudiante],
    synchronize: false, //lo puse en falso porque sino me crea la bd de nuevo
    logging: true
}); //crear la conexión con la bd cada vez, 
//utilizado en los controllers
function inicializeDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        yield createDatabaseIfNotExists();
        yield exports.AppDataSource.initialize();
    });
}
