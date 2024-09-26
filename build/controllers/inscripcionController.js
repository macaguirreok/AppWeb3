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
exports.actualizarInscripcion = exports.modificarInscripcion = exports.calificar = exports.consultarInscripciones = exports.borrarInscripcion = exports.inscribir = void 0;
const conexion_1 = require("../db/conexion");
const inscripcionModel_1 = require("../models/inscripcionModel");
const estudianteModel_1 = require("../models/estudianteModel");
const cursoModel_1 = require("../models/cursoModel");
const profesorModel_1 = require("../models/profesorModel");
const inscribir = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { estudiante_id, curso_id, fecha } = req.body;
    try {
        const estudiante = yield conexion_1.AppDataSource.getRepository(estudianteModel_1.Estudiante).findOne({ where: { id: estudiante_id } });
        const curso = yield conexion_1.AppDataSource.getRepository(cursoModel_1.Curso).findOne({ where: { id: curso_id } });
        if (!estudiante || !curso) {
            res.status(400).json({ mensaje: 'Estudiante o curso no encontrado.' });
            return;
        }
        const inscripcion = new inscripcionModel_1.CursoEstudiante();
        inscripcion.estudiante = estudiante;
        inscripcion.curso = curso;
        inscripcion.fecha = fecha;
        yield conexion_1.AppDataSource.getRepository(inscripcionModel_1.CursoEstudiante).save(inscripcion);
        res.redirect('/inscripciones/listarInscripciones');
    }
    catch (err) {
        console.error('Error al inscribir al estudiante:', err);
        res.status(500).send('Error al inscribir al estudiante');
    }
});
exports.inscribir = inscribir;
const borrarInscripcion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield conexion_1.AppDataSource.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            const inscripcionRepository = transactionalEntityManager.getRepository(inscripcionModel_1.CursoEstudiante);
            const resultado = yield inscripcionRepository.delete({ curso_id: parseInt(req.params.curso_id), estudiante_id: parseInt(req.params.estudiante_id) });
            if (resultado.affected == 1) {
                return res.json({ mensaje: 'Inscripción eliminada' });
            }
            else {
                return res.json({ mensaje: 'No se ha podido eliminar la inscripción ' });
            }
        }));
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
});
exports.borrarInscripcion = borrarInscripcion;
const consultarInscripciones = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cursoEstudianteRepository = conexion_1.AppDataSource.getRepository(inscripcionModel_1.CursoEstudiante);
        const estudiantesRepository = conexion_1.AppDataSource.getRepository(estudianteModel_1.Estudiante);
        const cursosRepository = conexion_1.AppDataSource.getRepository(cursoModel_1.Curso);
        const inscripciones = (yield cursoEstudianteRepository.find({ relations: ['estudiante', 'curso'] })) || [];
        const estudiantes = (yield estudiantesRepository.find()) || [];
        const cursos = (yield cursosRepository.find()) || [];
        res.render('listarInscripciones', {
            pagina: 'Lista de Inscripciones',
            inscripciones,
            estudiantes,
            cursos
        });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
});
exports.consultarInscripciones = consultarInscripciones;
const calificar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre, descripcion, profesor_id } = req.body;
        const cursoRepository = conexion_1.AppDataSource.getRepository(cursoModel_1.Curso);
        const profesorRepository = conexion_1.AppDataSource.getRepository(profesorModel_1.Profesor);
        // Buscar el curso
        const curso = yield cursoRepository.findOneBy({ id: parseInt(req.params.id) });
        if (!curso) {
            return res.status(404).send('Curso no encontrado');
        }
        // Buscar el profesor
        const profesor = yield profesorRepository.findOneBy({ id: parseInt(profesor_id) });
        if (!profesor) {
            return res.status(404).send('Profesor no encontrado');
        }
        // Actualizar los campos del curso
        curso.nombre = nombre;
        curso.descripcion = descripcion;
        curso.profesor = profesor;
        // Guardar el curso actualizado
        yield cursoRepository.save(curso);
        // Redirigir a la lista de cursos
        res.redirect('/cursos/listarCursos');
    }
    catch (error) {
        console.error('Error al actualizar el curso:', error);
        res.status(500).send('Error al actualizar el curso');
    }
});
exports.calificar = calificar;
const modificarInscripcion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { curso_id, estudiante_id } = req.params;
    try {
        const inscripcionRepository = conexion_1.AppDataSource.getRepository(inscripcionModel_1.CursoEstudiante);
        // Buscar la inscripción específica
        const inscripcion = yield inscripcionRepository.findOne({
            where: {
                curso: { id: parseInt(curso_id) },
                estudiante: { id: parseInt(estudiante_id) }
            },
            relations: ['curso', 'estudiante']
        });
        if (!inscripcion) {
            res.status(404).json({ mensaje: 'Inscripción no encontrada.' });
            return;
        }
        // Renderizar la vista para modificar la inscripción
        res.render('modificarInscripcion', {
            pagina: 'Modificar Inscripción',
            inscripcion
        });
    }
    catch (error) {
        console.error('Error al obtener la inscripción:', error);
        res.status(500).send('Error al obtener la inscripción.');
    }
});
exports.modificarInscripcion = modificarInscripcion;
const actualizarInscripcion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { curso_id, estudiante_id } = req.params;
    const { nota, fecha } = req.body;
    try {
        const inscripcionRepository = conexion_1.AppDataSource.getRepository(inscripcionModel_1.CursoEstudiante);
        // Buscar la inscripción específica
        const inscripcion = yield inscripcionRepository.findOne({
            where: {
                curso: { id: parseInt(curso_id) },
                estudiante: { id: parseInt(estudiante_id) }
            },
            relations: ['curso', 'estudiante']
        });
        if (!inscripcion) {
            res.status(404).json({ mensaje: 'Inscripción no encontrada.' });
            return;
        }
        // Actualizar la nota y la fecha
        inscripcion.nota = nota || inscripcion.nota;
        inscripcion.fecha = fecha || inscripcion.fecha;
        // Guardar los cambios
        yield inscripcionRepository.save(inscripcion);
        res.redirect('/inscripciones/listarInscripciones');
    }
    catch (error) {
        console.error('Error al actualizar la inscripción:', error);
        res.status(500).send('Error al actualizar la inscripción.');
    }
});
exports.actualizarInscripcion = actualizarInscripcion;
