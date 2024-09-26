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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//const express = require("express");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router(); //el route puede manejar las rutas
//const ProfesoresController = require("../controller/profesoresController");
//const profesoresController = require("../controller/profesoresController");
const cursosController_1 = require("../controllers/cursosController");
const conexion_1 = require("../db/conexion");
const profesorModel_1 = require("../models/profesorModel");
router.get('/listarCursos', cursosController_1.consultarCursos);
//insertar
router.get('/crearCurso', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profesores = yield conexion_1.AppDataSource.getRepository(profesorModel_1.Profesor).find();
        res.render('crearCursos', {
            pagina: 'Crear Curso',
            profesores
        });
    }
    catch (error) {
        console.error("Error al obtener los profesores:", error);
        res.status(500).send("Error al obtener los profesores");
    }
}));
router.post('/', cursosController_1.insertar);
//modificar
router.get('/modificarCurso/:id', cursosController_1.modificar);
router.post('/modificarCurso/:id', cursosController_1.actualizarCurso);
router.route('/:id')
    .delete(cursosController_1.borrar)
    //.put(modificar)
    .get(cursosController_1.consultarUno);
//module.exports = route; //const manejador de rutas
exports.default = router;
