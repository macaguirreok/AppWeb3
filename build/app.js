"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express")); //rutas y servidores
const cors_1 = __importDefault(require("cors")); //peticiones
const morgan_1 = __importDefault(require("morgan")); //registra peticiones, lo pedido a y lo devuelto x el servidor
const estudiantesRoutes_1 = __importDefault(require("./routes/estudiantesRoutes"));
const profesoresRoutes_1 = __importDefault(require("./routes/profesoresRoutes"));
const inscripcionRoutes_1 = __importDefault(require("./routes/inscripcionRoutes"));
const cursosRoutes_1 = __importDefault(require("./routes/cursosRoutes")); //importa router para modularizar las rutas
const path_1 = __importDefault(require("path")); //módulo: trabaja con las rutas de los archivos
const method_override_1 = __importDefault(require("method-override"));
const app = (0, express_1.default)(); //la aplicación: EL SERVIDOR WEB -> definir rutas
app.use((0, method_override_1.default)('_method'));
app.use(express_1.default.json()); //permite al servidor manerja JSON
app.use(express_1.default.urlencoded({ extended: true })); //permite usar el req
app.use((0, morgan_1.default)('dev')); // morgarn en modo desarrollo (legible)
app.use((0, cors_1.default)()); //nuestra api = reciba peticiones de todos los dominios
// Configuración del motor de plantillas:
app.set('view engine', 'pug'); //configura pug
app.set('views', path_1.default.join(__dirname, 'public', 'views')); //ruta donde están las vistas 
// path.join ruta compatible con cualquier sistema operativo 
//une rutas en una sola
// Ruta a la carpeta de donde se van a sacar los recursos estáticos:
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
//los archivos estáticos van a servir desde public
app.get('/', (req, res) => {
    console.log(__dirname);
    return res.render('index', {
        pagina: 'App Univerdsidad',
        // errores: errores.array()
    });
});
app.use('/estudiantes', estudiantesRoutes_1.default); //maneja las rutas 
app.use('/profesores', profesoresRoutes_1.default);
app.use('/cursos', cursosRoutes_1.default);
app.use('/inscripciones', inscripcionRoutes_1.default);
exports.default = app; // exportamos app para que pueda ser importada
//en otro archivo, como index (donde iniciamos el servidor)
