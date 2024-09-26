//const express = require("express");
import express from "express";
const router = express.Router(); //el route puede manejar las rutas
//const ProfesoresController = require("../controller/profesoresController");
//const profesoresController = require("../controller/profesoresController");
import { consultar, insertar, consultarUno, borrar, modificar} from '../controllers/profesoresController';
import { AppDataSource } from '../db/conexion';
import { Profesor } from '../models/profesorModel';


router.get('/listarProfesores',consultar);


//vista para insertar
router.get('/crearProfesores', (req, res) => {
      res.render('crearProfesores', {
          pagina: 'Crear Profesor',
      });
  });
  // la ruta donde se hace el post
  router.post('/',insertar);


router.route('/:id')
       .delete(borrar)
     // .put(modificar)
      .get(consultarUno);

// Modificar profesor
router.get('/modificaProfesor/:id', async (req, res) => {
  const { id } = req.params;
  const profesorRepository = AppDataSource.getRepository(Profesor);
  const profesor = await profesorRepository.findOne({ where: { id: parseInt(id) } });

  if (!profesor) {
      return res.status(404).send('Estudiante no encontrado');
  }

  res.render('modificarProfesor', {
      pagina: 'Modificar Profesor',
      profesor
  });
});
router.post('/:id', modificar);

//module.exports = route; //const manejador de rutas
export default router;