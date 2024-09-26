
import express from "express";
const router = express.Router(); //el route puede manejar las rutas
import { consultar, insertar, borrar, modificar, consultarUno} from '../controllers/estudiantesController';



router.get('/listarEstudiantes', consultar);


//router.post('/',insertar);
//insertar
router.get('/crearEstudiantes', (req, res) => { //ver la vista
      res.render('crearEstudiantes', {
          pagina: 'Crear Estudiante',
      });
  });

router.post('/' , insertar); //es para el botón de la vista

//modificar
router.get('/modificarEstudiante/:id', async (req, res) => {
    try {
        const estudiante = await consultarUno(req, res); 
        if (!estudiante) {
            return res.status(404).send('Estudiante no encontrado');
        }
        res.render('modificarEstudiante', {
            estudiante //objetos q tiene los datos disponibles en la vista
        });
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
});

router.route('/:id')
      .delete(borrar)
      .put(modificar)
      .get(consultarUno);

//module.exports = route; //const manejador de rutas en javascript
export default router;