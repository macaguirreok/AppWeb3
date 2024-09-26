//const express = require("express");
import express from "express";
const router = express.Router(); //el route puede manejar las rutas
//const ProfesoresController = require("../controller/profesoresController");
//const profesoresController = require("../controller/profesoresController");
import { consultarCursos, insertar, borrar, modificar, consultarUno, actualizarCurso} from '../controllers/cursosController';
import { AppDataSource } from '../db/conexion';
import { Profesor } from '../models/profesorModel';

router.get('/listarCursos',consultarCursos);


//insertar
router.get('/crearCurso', async (req, res) => {
    try {
        const profesores = await AppDataSource.getRepository(Profesor).find();
        res.render('crearCursos', {
            pagina: 'Crear Curso',
            profesores 
        });
    } catch (error) {
        console.error("Error al obtener los profesores:", error);
        res.status(500).send("Error al obtener los profesores");
    }
});

router.post('/', insertar);

//modificar
router.get('/modificarCurso/:id', modificar); 
router.post('/modificarCurso/:id', actualizarCurso);

router.route('/:id')
      .delete(borrar)
      //.put(modificar)
      .get(consultarUno);

//module.exports = route; //const manejador de rutas
export default router;