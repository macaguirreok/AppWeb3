
import express, { NextFunction } from 'express';

import { Request,Response } from "express";// maneja el tipo de solicitudes
import { check, validationResult } from 'express-validator'; //valida campos
import { AppDataSource } from '../db/conexion'; //llama a la conexión de la bd
import {Estudiante} from '../models/estudianteModel'; //representación de la tabla estudiantes de la bd
import { CursoEstudiante } from '../models/inscripcionModel';

let estudiantes: Estudiante[];

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


    

    export const insertar = async (req: Request, res: Response): Promise<void> => {
      
      //validacion agregada 
      const errores = validationResult(req);
      if (!errores.isEmpty()) {
        res.status(400).json({ errores: errores.array() });
          /*return res.render('cargaEstudiantes', {
              pagina: 'Crear Estudiante',
              errores: errores.array()
          });*/
      }
      
      
      const { dni, nombre, apellido, email } = req.body;
  
      try {
          await AppDataSource.transaction(async (transactionalEntityManager) => {
              const estudianteRepository = transactionalEntityManager.getRepository(Estudiante);
              const existeEstudiante = await estudianteRepository.findOne({
                  where: [
                      { dni },
                      { email }
                  ]
              });
  
              if (existeEstudiante) {
                  throw new Error('El estudiante ya existe.');
              }
              const nuevoEstudiante = estudianteRepository.create({ dni, nombre, apellido, email });
              await estudianteRepository.save(nuevoEstudiante);
          });
  
          // Devolver una respuesta JSON
          const estudiantes = await AppDataSource.getRepository(Estudiante).find();
          /*res.status(201).json({
              mensaje: 'Estudiante insertado correctamente',
              estudiantes
          });*/
          res.render('listarEstudiantes', {
            pagina: 'Lista de Estudiantes',
            estudiantes
        });
      } catch (err: unknown) {
          if (err instanceof Error) {
              res.status(500).json({ mensaje: err.message });
          }
      }
  };
    


   /* export const borrar= async (req:Request,res:Response) =>{
          
            try{
             res.send("borrar");
            }catch(err){
              if(err instanceof Error){
                res.status(500).send(err.message);}}}*/

    
                export const borrar = async (req: Request, res: Response): Promise<void> => {
                  const { id } = req.params; // 
                  try {
                      //console.log(`ID recibido para eliminar: ${id}`); 
                      await AppDataSource.transaction(async transactionalEntityManager => { // 1 - transacción a la bd 
                          const cursosEstudiantesRepository = transactionalEntityManager.getRepository(CursoEstudiante); //2 - crea los repositorios
                          const estudianteRepository = transactionalEntityManager.getRepository(Estudiante);
              
                          const cursosRelacionados = await cursosEstudiantesRepository.count({ where: { estudiante: { id: Number(id) } } });
                          if (cursosRelacionados > 0) {
                              throw new Error('Estudiante cursando materias, no se puede eliminar');
                          }
                          const deleteResult = await estudianteRepository.delete(id);
              
                          if (deleteResult.affected === 1) {
                              return res.json({ mensaje: 'Estudiante eliminado' }); 
                          } else {
                              throw new Error('Estudiante no encontrado');
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
             
      

    /*export const modificar= async (req:Request,res:Response) =>{
  
    try {
          res.send("modificar");
                
          } catch (err) {
            if(err instanceof Error){
            res.status(500).send(err.message); 
          }}
    }*/

          export const modificar = async (req: Request, res: Response)=> {
            const { id } = req.params; 
            const { dni, nombre, apellido, email } = req.body; 
            try {   
                const estudianteRepository = AppDataSource.getRepository(Estudiante);
                const estudiante = await estudianteRepository.findOne({ where: { id: parseInt(id) } });
                
                if (!estudiante) {
                    return res.status(404).send('Estudiante no encontrado');
                }
                estudianteRepository.merge(estudiante, { dni, nombre, apellido, email });
                await estudianteRepository.save(estudiante);
                return res.redirect('/estudiantes/listarEstudiantes');
            } catch (error) {
                console.error('Error al modificar el estudiante:', error);
                return res.status(500).send('Error del servidor');
            }
        };

 

   export const consultar= async (req:Request,res:Response) =>{

      try {
        const estudianteRepository = AppDataSource.getRepository(Estudiante);
        estudiantes = await estudianteRepository.find();
        res.render('listarEstudiantes', { //nombre del archivo pug
          pagina: 'Lista de Estudiantes', //nombre de la pagina
          estudiantes
        })
      } catch (err: unknown) {
        if(err instanceof Error){
          res.status(500).send(err.message); 
        }
       
      }

    }

     

    /*export const consultarUno= async (req:Request,res:Response) =>{

    try {
      
      res.send("consultar uno");
      
    } catch (err) {
      if(err instanceof Error){
      res.status(500).send(err.message);
    }}
    }*/

    export const consultarUno = async (req: Request, res: Response): Promise<Estudiante | null> => {
    
      const { id } = req.params;
      const idNumber = Number(id);
      if (isNaN(idNumber)) {
          throw new Error('ID inválido, debe ser un número');
      }
      try {
         
          const estudianteRepository = AppDataSource.getRepository(Estudiante);
          const estudiante = await estudianteRepository.findOne({ where: { id: idNumber } });
          
          //console.log(estudiante);
          if (estudiante) {
            //res.json(estudiante); es para que me traiga los datos del json
             return estudiante;
            
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

  export const buscarUnEstudiante = async (idEst:number, res:Response):Promise<Estudiante | null | undefined>=>{
    try{
      const estudianteRepository = AppDataSource.getRepository(Estudiante);
        const estudiante = await estudianteRepository.findOneBy({id:idEst});
        if(estudiante){
            return estudiante;
        } else {
            return null;
        }
    }catch(err:unknown){
        if(err instanceof Error){
            res.render('capturaErrores',{
                pagina: 'Error en la grabación de la infromación',
                falla: err.message
            });
        }
    }
}

export const buscarEstudiantes = async (req:Request,res:Response):Promise<Estudiante[] | null | undefined>=>{
  try{
    const estudianteRepository = AppDataSource.getRepository(Estudiante);
      const estudiantes = await estudianteRepository.find();
      if(estudiantes){
          return estudiantes;
      } else {
          return null;
      }
  } catch(err:unknown){
      if(err instanceof Error){
          res.render('capturaErrores',{
              pagina: 'Error en la grabación de la infromación',
              falla: err.message
          });
      }
  }
}





