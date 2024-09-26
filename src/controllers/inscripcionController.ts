import { Request,Response } from "express";
import { AppDataSource } from '../db/conexion';
import { CursoEstudiante } from '../models/inscripcionModel';
import { Estudiante } from '../models/estudianteModel';
import { Curso } from '../models/cursoModel'
import { Profesor } from "../models/profesorModel";



export const inscribir = async (req: Request, res: Response): Promise<void> => {
    const { estudiante_id, curso_id, fecha } = req.body;

    try {
        const estudiante = await AppDataSource.getRepository(Estudiante).findOne({ where: { id: estudiante_id } });
        const curso = await AppDataSource.getRepository(Curso).findOne({ where: { id: curso_id } });

        if (!estudiante || !curso) {
            res.status(400).json({ mensaje: 'Estudiante o curso no encontrado.' });
            return;
        }

        const inscripcion = new CursoEstudiante();
        inscripcion.estudiante = estudiante;
        inscripcion.curso = curso;
        inscripcion.fecha = fecha;

        await AppDataSource.getRepository(CursoEstudiante).save(inscripcion);
        res.redirect('/inscripciones/listarInscripciones');
    } catch (err) {
        console.error('Error al inscribir al estudiante:', err);
        res.status(500).send('Error al inscribir al estudiante');
    }
};



export const borrarInscripcion = async (req:Request,res:Response):Promise<void>=>{
    try{
        await AppDataSource.transaction(async transactionalEntityManager=>{
            const inscripcionRepository = transactionalEntityManager.getRepository(CursoEstudiante);
            const resultado = await inscripcionRepository.delete({curso_id:parseInt(req.params.curso_id),estudiante_id:parseInt(req.params.estudiante_id)});
            if(resultado.affected == 1){
                return res.json({mensaje: 'Inscripción eliminada'});
            } else {
                return res.json({mensaje: 'No se ha podido eliminar la inscripción '});
            }
        });
    }catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
}



export const consultarInscripciones = async (req: Request, res: Response) => {
    try {
        const cursoEstudianteRepository = AppDataSource.getRepository(CursoEstudiante);
        const estudiantesRepository = AppDataSource.getRepository(Estudiante);
        const cursosRepository = AppDataSource.getRepository(Curso);
        
        const inscripciones = await cursoEstudianteRepository.find({ relations: ['estudiante', 'curso'] }) || [];
        const estudiantes = await estudiantesRepository.find() || [];
        const cursos = await cursosRepository.find() || [];
        
        res.render('listarInscripciones', {
            pagina: 'Lista de Inscripciones',
            inscripciones,
            estudiantes,
            cursos
        });
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
};

export const calificar= async (req:Request,res:Response) =>{
    try {
      const { nombre, descripcion, profesor_id } = req.body;

      const cursoRepository = AppDataSource.getRepository(Curso);
      const profesorRepository = AppDataSource.getRepository(Profesor);

      // Buscar el curso
      const curso = await cursoRepository.findOneBy({ id: parseInt(req.params.id) });
      if (!curso) {
          return res.status(404).send('Curso no encontrado');
      }

      // Buscar el profesor
      const profesor = await profesorRepository.findOneBy({ id: parseInt(profesor_id) });
      if (!profesor) {
          return res.status(404).send('Profesor no encontrado');
      }

      // Actualizar los campos del curso
      curso.nombre = nombre;
      curso.descripcion = descripcion;
      curso.profesor = profesor;

      // Guardar el curso actualizado
      await cursoRepository.save(curso);

      // Redirigir a la lista de cursos
      res.redirect('/cursos/listarCursos');
  } catch (error) {
      console.error('Error al actualizar el curso:', error);
      res.status(500).send('Error al actualizar el curso');
  }
      }


      export const modificarInscripcion = async (req: Request, res: Response): Promise<void> => {
        const { curso_id, estudiante_id } = req.params;
    
        try {
            const inscripcionRepository = AppDataSource.getRepository(CursoEstudiante);
    
            // Buscar la inscripción específica
            const inscripcion = await inscripcionRepository.findOne({
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
        } catch (error) {
            console.error('Error al obtener la inscripción:', error);
            res.status(500).send('Error al obtener la inscripción.');
        }
    };

    export const actualizarInscripcion = async (req: Request, res: Response): Promise<void> => {
        const { curso_id, estudiante_id } = req.params;
        const { nota, fecha } = req.body;
    
        try {
            const inscripcionRepository = AppDataSource.getRepository(CursoEstudiante);
    
            // Buscar la inscripción específica
            const inscripcion = await inscripcionRepository.findOne({
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
            await inscripcionRepository.save(inscripcion);
    
            res.redirect('/inscripciones/listarInscripciones');
        } catch (error) {
            console.error('Error al actualizar la inscripción:', error);
            res.status(500).send('Error al actualizar la inscripción.');
        }
    };
