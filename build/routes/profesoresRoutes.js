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
const profesoresController_1 = require("../controllers/profesoresController");
const conexion_1 = require("../db/conexion");
const profesorModel_1 = require("../models/profesorModel");
router.get('/listarProfesores', profesoresController_1.consultar);
//vista para insertar
router.get('/crearProfesores', (req, res) => {
    res.render('crearProfesores', {
        pagina: 'Crear Profesor',
    });
});
// la ruta donde se hace el post
router.post('/', profesoresController_1.insertar);
router.route('/:id')
    .delete(profesoresController_1.borrar)
    // .put(modificar)
    .get(profesoresController_1.consultarUno);
// Modificar profesor
router.get('/modificaProfesor/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const profesorRepository = conexion_1.AppDataSource.getRepository(profesorModel_1.Profesor);
    const profesor = yield profesorRepository.findOne({ where: { id: parseInt(id) } });
    if (!profesor) {
        return res.status(404).send('Estudiante no encontrado');
    }
    res.render('modificarProfesor', {
        pagina: 'Modificar Profesor',
        profesor
    });
}));
router.post('/:id', profesoresController_1.modificar);
//module.exports = route; //const manejador de rutas
exports.default = router;
