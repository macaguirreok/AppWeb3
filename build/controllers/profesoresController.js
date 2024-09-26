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
exports.consultarUno = exports.consultar = exports.borrar = exports.insertar = exports.modificar = void 0;
const express_validator_1 = require("express-validator");
const conexion_1 = require("../db/conexion");
const profesorModel_1 = require("../models/profesorModel"); // Asegúrate de que el modelo de Profesor esté correctamente importado
const cursoModel_1 = require("../models/cursoModel");
let estudiantes;
// Agregamos una función que se va a llamar validar
/*export const validar = [
  check('dni')
    .notEmpty().withMessage('El DNI es obligatorio')
    .isLength({ min: 7 }).withMessage('El DNI debe tener al menos 7 caracteres'),
  check('nombre')
    .notEmpty().withMessage('El Nombre es obligatorio')
    .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
  check('apellido')
    .notEmpty().withMessage('El apellido es obligatorio')
    .isLength({ min: 3 }).withMessage('El apellido debe tener al menos 3 caracteres'),
  check('email')
    .isEmail().withMessage('Debe proporcionar un email válido'),
  check('profesion')
    .notEmpty().withMessage('La profesión es obligatoria'),
  check('telefono')
    .notEmpty().withMessage('El teléfono es obligatorio'),
  (req: Request, res: Response, next: NextFunction) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.render('crearProfesores', { // Asegúrate de que la vista coincida con tu archivo Pug/EJS
        pagina: 'Crear Profesor',
        errores: errores.array()
      });
    }
    next();
  }
];*/
const modificar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { dni, nombre, apellido, email, profesion, telefono } = req.body;
    const profesorRepository = conexion_1.AppDataSource.getRepository(profesorModel_1.Profesor);
    try {
        const elProfesor = yield profesorRepository.findOneBy({ id: parseInt(req.params.id) });
        if (elProfesor) {
            profesorRepository.merge(elProfesor, req.body);
            const resultado = yield profesorRepository.save(elProfesor);
            return res.redirect('/profesores/listarProfesores');
        }
        else {
            res.status(400).json({ mensaje: 'No se ha encontrado el profesor' });
        }
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
});
exports.modificar = modificar;
const insertar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Validación agregada
    const errores = (0, express_validator_1.validationResult)(req);
    if (!errores.isEmpty()) {
        res.status(400).json({ errores: errores.array() });
    }
    const { dni, nombre, apellido, email, profesion, telefono } = req.body;
    try {
        yield conexion_1.AppDataSource.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            const profesorRepository = transactionalEntityManager.getRepository(profesorModel_1.Profesor);
            const existeProfesor = yield profesorRepository.findOne({
                where: [
                    { dni },
                    { email }
                ]
            });
            if (existeProfesor) {
                throw new Error('El profesor ya existe.');
            }
            const nuevoProfesor = profesorRepository.create({ dni, nombre, apellido, email, profesion, telefono });
            yield profesorRepository.save(nuevoProfesor);
        }));
        // Devolver una respuesta JSON
        const profesores = yield conexion_1.AppDataSource.getRepository(profesorModel_1.Profesor).find();
        // res.json("el profesor fue insertado"); PRUEBA PARA EL POSTMAN
        res.render('listarProfesores', {
            pagina: 'Lista de Profesores',
            profesores
        });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ mensaje: err.message });
        }
    }
});
exports.insertar = insertar;
const borrar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; //se manda por parámetro el id del profesor que se quiere eliminar
    try {
        //console.log(`ID recibido para eliminar: ${id}`); 
        yield conexion_1.AppDataSource.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            const cursosRepository = transactionalEntityManager.getRepository(cursoModel_1.Curso);
            const profesorRepository = transactionalEntityManager.getRepository(profesorModel_1.Profesor);
            const cursosRelacionados = yield cursosRepository.count({ where: { profesor: { id: Number(id) } } }); //lo saca del repositorio del curso
            if (cursosRelacionados > 0) { // donde esta el profesor
                throw new Error('Profesor está asignado a un curso, no se puede eliminar');
            }
            const deleteResult = yield profesorRepository.delete(id);
            if (deleteResult.affected === 1) {
                return res.json({ mensaje: 'Profesor eliminado' });
            }
            else {
                throw new Error('Profesor no encontrado');
            }
        }));
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ mensaje: err.message });
        }
        else {
            res.status(400).json({ mensaje: 'Error' });
        }
    }
});
exports.borrar = borrar;
/*export const modificar = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { dni, nombre, apellido, email, profesion, telefono } = req.body;
  try {
    const profesorRepository = AppDataSource.getRepository(Profesor);
    const profesor = await profesorRepository.findOne({ where: { id: parseInt(id) } });

    if (!profesor) {
      return res.status(404).send('Profesor no encontrado');
    }
    profesorRepository.merge(profesor, { dni, nombre, apellido, email, profesion, telefono });
    await profesorRepository.save(profesor);
    return res.redirect('/profesores/listarProfesores');
  } catch (error) {
    console.error('Error al modificar el profesor:', error);
    return res.status(500).send('Error del servidor');
  }
};*/
//CONSULTAR M
/*export const consultar = async (req: Request, res: Response): Promise<void> => {
  try {
    const profesorRepository = AppDataSource.getRepository(Profesor);
    const profesores = await profesorRepository.find();
    res.render('listarProfesores', { // Nombre del archivo pug para listar profesores
      pagina: 'Lista de Profesores',
      profesores
    });
    //res.json(profesores);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).send(err.message);
    }
  }
};*/
const consultar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profesorRepository = conexion_1.AppDataSource.getRepository(profesorModel_1.Profesor);
        const profesores = yield profesorRepository.find();
        res.render('listarProfesores', {
            pagina: 'Lista de Profesores',
            profesores
        });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
});
exports.consultar = consultar;
const consultarUno = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const idNumber = Number(id);
    if (isNaN(idNumber)) {
        throw new Error('ID inválido, debe ser un número');
    }
    try {
        const profesorRepository = conexion_1.AppDataSource.getRepository(profesorModel_1.Profesor);
        const profesor = yield profesorRepository.findOne({ where: { id: idNumber } });
        if (profesor) {
            return profesor;
        }
        else {
            return null;
        }
    }
    catch (err) {
        if (err instanceof Error) {
            throw err;
        }
        else {
            throw new Error('Error desconocido');
        }
    }
});
exports.consultarUno = consultarUno;
