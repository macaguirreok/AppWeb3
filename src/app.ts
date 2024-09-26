import express, {Request,Response} from "express"; //rutas y servidores
import cors from 'cors'; //peticiones
import morgan from "morgan"; //registra peticiones, lo pedido a y lo devuelto x el servidor
import estudianteRouter from './routes/estudiantesRoutes';
import profesorRouter from './routes/profesoresRoutes';
import inscripcionRouter from './routes/inscripcionRoutes';
import cursoRouter from './routes/cursosRoutes'; //importa router para modularizar las rutas

import path from 'path'; //módulo: trabaja con las rutas de los archivos
import methodOverride from 'method-override';

const app=express(); //la aplicación: EL SERVIDOR WEB -> definir rutas

app.use(methodOverride('_method'));
app.use(express.json()); //permite al servidor manerja JSON
app.use(express.urlencoded({extended:true})); //permite usar el req
app.use(morgan('dev'));// morgarn en modo desarrollo (legible)
app.use(cors()); //nuestra api = reciba peticiones de todos los dominios


// Configuración del motor de plantillas:

app.set('view engine', 'pug');//configura pug
app.set('views', path.join(__dirname, 'public', 'views')); //ruta donde están las vistas 
// path.join ruta compatible con cualquier sistema operativo 
//une rutas en una sola


// Ruta a la carpeta de donde se van a sacar los recursos estáticos:
app.use(express.static(path.join(__dirname, 'public')));
//los archivos estáticos van a servir desde public


app.get('/',(req:Request,res:Response)=>{ //ruta get 
    console.log(__dirname);
    return res.render('index', {
        pagina: 'App Univerdsidad',
       // errores: errores.array()
    });
});



app.use('/estudiantes',estudianteRouter); //maneja las rutas 
app.use('/profesores',profesorRouter);
app.use('/cursos',cursoRouter);
app.use('/inscripciones',inscripcionRouter);



export default app; // exportamos app para que pueda ser importada
//en otro archivo, como index (donde iniciamos el servidor)