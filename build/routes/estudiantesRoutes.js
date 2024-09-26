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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router(); //el route puede manejar las rutas
const estudiantesController_1 = require("../controllers/estudiantesController");
router.get('/listarEstudiantes', estudiantesController_1.consultar);
//router.post('/',insertar);
//insertar
router.get('/crearEstudiantes', (req, res) => {
    res.render('crearEstudiantes', {
        pagina: 'Crear Estudiante',
    });
});
router.post('/', estudiantesController_1.insertar); //es para el botón de la vista
//modificar
router.get('/modificarEstudiante/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const estudiante = yield (0, estudiantesController_1.consultarUno)(req, res);
        if (!estudiante) {
            return res.status(404).send('Estudiante no encontrado');
        }
        res.render('modificarEstudiante', {
            estudiante //objetos q tiene los datos disponibles en la vista
        });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
}));
router.route('/:id')
    .delete(estudiantesController_1.borrar)
    .put(estudiantesController_1.modificar)
    .get(estudiantesController_1.consultarUno);
//module.exports = route; //const manejador de rutas en javascript
exports.default = router;
