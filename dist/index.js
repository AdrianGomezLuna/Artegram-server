"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const usuario_1 = __importDefault(require("./routes/usuario"));
const post_1 = __importDefault(require("./routes/post"));
const server = new server_1.default();
//Body parser (función que se va a ejecutar siempre)
server.app.use(express_1.default.urlencoded({ extended: true }));
server.app.use(express_1.default.json());
//FileUpload
server.app.use((0, express_fileupload_1.default)());
//Configuracion CORS
// server.app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
// });
server.app.use((0, cors_1.default)({ origin: true, credentials: true }));
//Rutas de mi aplicación
server.app.use('/user', usuario_1.default);
server.app.use('/posts', post_1.default);
//Conectar DB
mongoose_1.default.connect('mongodb://localhost:27017/artegram', (err) => {
    if (err)
        throw err;
    console.log('Base de datos ONLINE');
});
//Levantar express
server.start(() => {
    console.log(`Servidor corriendo en puerto ${server.port}`);
});
