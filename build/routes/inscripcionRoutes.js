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
const inscripcionController_1 = require("../controllers/inscripcionController");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const conexion_1 = require("../db/conexion");
const estudianteModel_1 = require("../models/estudianteModel");
const cursoModel_1 = require("../models/cursoModel");
router.get("/listarInscripciones", inscripcionController_1.consultarInscripciones);
router.delete("/:curso_id/:estudiante_id", inscripcionController_1.borrarInscripcion);
//insertar
router.post('/', inscripcionController_1.inscribir);
router.get('/crearInscripcion', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const estudiantes = yield conexion_1.AppDataSource.getRepository(estudianteModel_1.Estudiante).find();
        const cursos = yield conexion_1.AppDataSource.getRepository(cursoModel_1.Curso).find();
        res.render('crearInscripcion', {
            pagina: 'Crear Inscripción',
            estudiantes,
            cursos
        });
    }
    catch (error) {
        console.error("Error al obtener los estudiantes o cursos:", error);
        res.status(500).send("Error al obtener los estudiantes o cursos");
    }
}));
router.post('/:curso_id/:estudiante_id/calificar', inscripcionController_1.calificar);
router.get('/:curso_id/:estudiante_id/modificar', inscripcionController_1.modificarInscripcion);
// Ruta para mostrar el formulario de modificación
router.put('/:curso_id/:estudiante_id', inscripcionController_1.actualizarInscripcion); // Ruta para actualizar la inscripción
exports.default = router;
