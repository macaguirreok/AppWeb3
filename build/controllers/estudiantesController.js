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
exports.buscarEstudiantes = exports.buscarUnEstudiante = exports.consultarUno = exports.consultar = exports.modificar = exports.borrar = exports.insertar = void 0;
const express_validator_1 = require("express-validator"); //valida campos
const conexion_1 = require("../db/conexion"); //llama a la conexión de la bd
const estudianteModel_1 = require("../models/estudianteModel"); //representación de la tabla estudiantes de la bd
const inscripcionModel_1 = require("../models/inscripcionModel");
let estudiantes;
//agregamos una función que se va a llamar validar
/*export const validar = () => {
 check('dni')
 .notEmpty().withMessage('El dni es obligatorio')
 .isLength({min:7}).withMessage('El DNI debe tener al menos 7 caracteres'),
 check('nombre').notEmpty().withMessage('El Nombre es obligatorio')
 .isLength({min:3}).withMessage('El nombre debe tener al menos 3 caracteres'),
 check('apellido').notEmpty().withMessage('El apellido es obligatorio')
 .isLength({min:3}).withMessage('El apellido debe tener al menos 3 caracteres'),
 check('email').isEmail().withMessage('Debe proporcionar un email válido'),
 (req:Request,res:Response, next:NextFunction) => {
   const errores = validationResult(req);
   if(!errores.isEmpty()){
     return res.render('creaEstudiantes',{
       pagina: 'Crear Estudiante',
       errores: errores.array()
     });
   }
   next();
 }
};*/
/*export const validar = [
  check('dni')
    .notEmpty().withMessage('El dni es obligatorio')
    .isLength({ min: 7 }).withMessage('El DNI debe tener al menos 7 caracteres'),
  check('nombre')
    .notEmpty().withMessage('El Nombre es obligatorio')
    .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
  check('apellido')
    .notEmpty().withMessage('El apellido es obligatorio')
    .isLength({ min: 3 }).withMessage('El apellido debe tener al menos 3 caracteres'),
  check('email')
    .isEmail().withMessage('Debe proporcionar un email válido'),
  (req: Request, res: Response, next: NextFunction) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.render('crearEstudiantes', { // Asegúrate de que la vista coincida con tu archivo Pug/EJS
        pagina: 'Crear Estudiante',
        errores: errores.array()
      });
      res.status(400).json({ errores: errores.array() });
    }
    next();
  }
];*/
const insertar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //validacion agregada 
    const errores = (0, express_validator_1.validationResult)(req);
    if (!errores.isEmpty()) {
        res.status(400).json({ errores: errores.array() });
        /*return res.render('cargaEstudiantes', {
            pagina: 'Crear Estudiante',
            errores: errores.array()
        });*/
    }
    const { dni, nombre, apellido, email } = req.body;
    try {
        yield conexion_1.AppDataSource.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            const estudianteRepository = transactionalEntityManager.getRepository(estudianteModel_1.Estudiante);
            const existeEstudiante = yield estudianteRepository.findOne({
                where: [
                    { dni },
                    { email }
                ]
            });
            if (existeEstudiante) {
                throw new Error('El estudiante ya existe.');
            }
            const nuevoEstudiante = estudianteRepository.create({ dni, nombre, apellido, email });
            yield estudianteRepository.save(nuevoEstudiante);
        }));
        // Devolver una respuesta JSON
        const estudiantes = yield conexion_1.AppDataSource.getRepository(estudianteModel_1.Estudiante).find();
        /*res.status(201).json({
            mensaje: 'Estudiante insertado correctamente',
            estudiantes
        });*/
        res.render('listarEstudiantes', {
            pagina: 'Lista de Estudiantes',
            estudiantes
        });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ mensaje: err.message });
        }
    }
});
exports.insertar = insertar;
/* export const borrar= async (req:Request,res:Response) =>{
       
         try{
          res.send("borrar");
         }catch(err){
           if(err instanceof Error){
             res.status(500).send(err.message);}}}*/
const borrar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // 
    try {
        //console.log(`ID recibido para eliminar: ${id}`); 
        yield conexion_1.AppDataSource.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            const cursosEstudiantesRepository = transactionalEntityManager.getRepository(inscripcionModel_1.CursoEstudiante); //2 - crea los repositorios
            const estudianteRepository = transactionalEntityManager.getRepository(estudianteModel_1.Estudiante);
            const cursosRelacionados = yield cursosEstudiantesRepository.count({ where: { estudiante: { id: Number(id) } } });
            if (cursosRelacionados > 0) {
                throw new Error('Estudiante cursando materias, no se puede eliminar');
            }
            const deleteResult = yield estudianteRepository.delete(id);
            if (deleteResult.affected === 1) {
                return res.json({ mensaje: 'Estudiante eliminado' });
            }
            else {
                throw new Error('Estudiante no encontrado');
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
/*export const modificar= async (req:Request,res:Response) =>{

try {
      res.send("modificar");
            
      } catch (err) {
        if(err instanceof Error){
        res.status(500).send(err.message);
      }}
}*/
const modificar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { dni, nombre, apellido, email } = req.body;
    try {
        const estudianteRepository = conexion_1.AppDataSource.getRepository(estudianteModel_1.Estudiante);
        const estudiante = yield estudianteRepository.findOne({ where: { id: parseInt(id) } });
        if (!estudiante) {
            return res.status(404).send('Estudiante no encontrado');
        }
        estudianteRepository.merge(estudiante, { dni, nombre, apellido, email });
        yield estudianteRepository.save(estudiante);
        return res.redirect('/estudiantes/listarEstudiantes');
    }
    catch (error) {
        console.error('Error al modificar el estudiante:', error);
        return res.status(500).send('Error del servidor');
    }
});
exports.modificar = modificar;
const consultar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const estudianteRepository = conexion_1.AppDataSource.getRepository(estudianteModel_1.Estudiante);
        estudiantes = yield estudianteRepository.find();
        res.render('listarEstudiantes', {
            pagina: 'Lista de Estudiantes', //nombre de la pagina
            estudiantes
        });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
});
exports.consultar = consultar;
/*export const consultarUno= async (req:Request,res:Response) =>{

try {
  
  res.send("consultar uno");
  
} catch (err) {
  if(err instanceof Error){
  res.status(500).send(err.message);
}}
}*/
const consultarUno = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const idNumber = Number(id);
    if (isNaN(idNumber)) {
        throw new Error('ID inválido, debe ser un número');
    }
    try {
        const estudianteRepository = conexion_1.AppDataSource.getRepository(estudianteModel_1.Estudiante);
        const estudiante = yield estudianteRepository.findOne({ where: { id: idNumber } });
        //console.log(estudiante);
        if (estudiante) {
            //res.json(estudiante); es para que me traiga los datos del json
            return estudiante;
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
const buscarUnEstudiante = (idEst, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const estudianteRepository = conexion_1.AppDataSource.getRepository(estudianteModel_1.Estudiante);
        const estudiante = yield estudianteRepository.findOneBy({ id: idEst });
        if (estudiante) {
            return estudiante;
        }
        else {
            return null;
        }
    }
    catch (err) {
        if (err instanceof Error) {
            res.render('capturaErrores', {
                pagina: 'Error en la grabación de la infromación',
                falla: err.message
            });
        }
    }
});
exports.buscarUnEstudiante = buscarUnEstudiante;
const buscarEstudiantes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const estudianteRepository = conexion_1.AppDataSource.getRepository(estudianteModel_1.Estudiante);
        const estudiantes = yield estudianteRepository.find();
        if (estudiantes) {
            return estudiantes;
        }
        else {
            return null;
        }
    }
    catch (err) {
        if (err instanceof Error) {
            res.render('capturaErrores', {
                pagina: 'Error en la grabación de la infromación',
                falla: err.message
            });
        }
    }
});
exports.buscarEstudiantes = buscarEstudiantes;
