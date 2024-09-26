import { consultarInscripciones, borrarInscripcion, inscribir, calificar, modificarInscripcion, actualizarInscripcion } from "../controllers/inscripcionController"; 
import express from "express";
const router = express.Router();
import { Request, Response} from "express";
import { AppDataSource } from '../db/conexion';
import { Estudiante } from '../models/estudianteModel';
import { Curso } from '../models/cursoModel';


router.get("/listarInscripciones",consultarInscripciones);

router.delete("/:curso_id/:estudiante_id",borrarInscripcion);

//insertar
router.post('/',inscribir);

router.get('/crearInscripcion', async (req:Request, res:Response) => {
    try {
        const estudiantes = await AppDataSource.getRepository(Estudiante).find();
        const cursos = await AppDataSource.getRepository(Curso).find();
        res.render('crearInscripcion', {
            pagina: 'Crear Inscripción',
            estudiantes,
            cursos 
        });
    } catch (error) {
        console.error("Error al obtener los estudiantes o cursos:", error);
        res.status(500).send("Error al obtener los estudiantes o cursos");
    }
});

router.post('/:curso_id/:estudiante_id/calificar', calificar);
router.get('/:curso_id/:estudiante_id/modificar', modificarInscripcion);
 // Ruta para mostrar el formulario de modificación
 router.put('/:curso_id/:estudiante_id', actualizarInscripcion); // Ruta para actualizar la inscripción


export default router;