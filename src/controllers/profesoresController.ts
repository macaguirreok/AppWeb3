import express, { NextFunction } from 'express';
import { Request, Response } from "express";
import { check, validationResult } from 'express-validator';
import { AppDataSource } from '../db/conexion';
import { Profesor } from '../models/profesorModel'; // Asegúrate de que el modelo de Profesor esté correctamente importado
import { CursoEstudiante } from '../models/inscripcionModel'; // Reutilizando el modelo existente si es necesario
import { Curso } from '../models/cursoModel';

let estudiantes: Profesor[];

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

export const modificar = async (req: Request, res: Response): Promise<void> => {
  const { dni, nombre, apellido, email, profesion, telefono } = req.body;
  const profesorRepository = AppDataSource.getRepository(Profesor);

  try {
      const elProfesor = await profesorRepository.findOneBy({ id: parseInt(req.params.id) });
      if (elProfesor) {
          profesorRepository.merge(elProfesor, req.body);
          const resultado = await profesorRepository.save(elProfesor);
          return res.redirect('/profesores/listarProfesores');
      } else {
          res.status(400).json({ mensaje: 'No se ha encontrado el profesor' });
      }
  } catch (err: unknown) {
      if (err instanceof Error) {
          res.status(500).send(err.message);
      }
  }
};


export const insertar = async (req: Request, res: Response): Promise<void> => {
  // Validación agregada
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    res.status(400).json({ errores: errores.array() });
    
  }

  const { dni, nombre, apellido, email, profesion, telefono } = req.body;

  try {
    await AppDataSource.transaction(async (transactionalEntityManager) => {
      const profesorRepository = transactionalEntityManager.getRepository(Profesor);
      const existeProfesor = await profesorRepository.findOne({
        where: [
          { dni },
          { email }
        ]
      });

      if (existeProfesor) {
        throw new Error('El profesor ya existe.');
      }
      const nuevoProfesor = profesorRepository.create({ dni, nombre, apellido, email, profesion, telefono });
      await profesorRepository.save(nuevoProfesor);
    });

    // Devolver una respuesta JSON
    const profesores = await AppDataSource.getRepository(Profesor).find();
   // res.json("el profesor fue insertado"); PRUEBA PARA EL POSTMAN
      res.render('listarProfesores', { // Nombre del archivo pug para listar profesores
      pagina: 'Lista de Profesores',
      profesores
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ mensaje: err.message });
    }
  }
};

export const borrar = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params; //se manda por parámetro el id del profesor que se quiere eliminar
  try {
      //console.log(`ID recibido para eliminar: ${id}`); 
      await AppDataSource.transaction(async transactionalEntityManager => {
          const cursosRepository = transactionalEntityManager.getRepository(Curso);
          const profesorRepository = transactionalEntityManager.getRepository(Profesor);

          const cursosRelacionados = await cursosRepository.count({ where: { profesor: { id: Number(id) } } }); //lo saca del repositorio del curso
          if (cursosRelacionados > 0) {                                                                     // donde esta el profesor
              throw new Error('Profesor está asignado a un curso, no se puede eliminar');
          }
          const deleteResult = await profesorRepository.delete(id);

          if (deleteResult.affected === 1) {
              return res.json({ mensaje: 'Profesor eliminado' }); 
          } else {
              throw new Error('Profesor no encontrado');
          }
      });
  } catch (err: unknown) {
      if (err instanceof Error) {
          res.status(400).json({ mensaje: err.message });
      } else {
          res.status(400).json({ mensaje: 'Error' });
      }
  }
};  

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

export const consultar = async (req: Request, res: Response) => {
  try {
      const profesorRepository = AppDataSource.getRepository(Profesor);
      const profesores = await profesorRepository.find();
      res.render('listarProfesores', {
          pagina: 'Lista de Profesores',
          profesores
      });
  } catch (err: unknown) {
      if (err instanceof Error) {
          res.status(500).send(err.message);
      }
  }
};

export const consultarUno = async (req: Request, res: Response): Promise<Profesor | null> => {
  const { id } = req.params;
  const idNumber = Number(id);
  if (isNaN(idNumber)) {
    throw new Error('ID inválido, debe ser un número');
  }
  try {
    const profesorRepository = AppDataSource.getRepository(Profesor);
    const profesor = await profesorRepository.findOne({ where: { id: idNumber } });

    if (profesor) {
      return profesor;
    } else {
      return null;
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw err;
    } else {
      throw new Error('Error desconocido');
    }
  }
};

