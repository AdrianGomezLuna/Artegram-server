import Server from './classes/server';
import mongoose from 'mongoose';
import cors from 'cors';

import express from 'express';
import fileUpload from 'express-fileupload';

import userRoutes from './routes/usuario';
import postRoutes from './routes/post';

const server = new Server();

//Body parser (función que se va a ejecutar siempre)
server.app.use( express.urlencoded({extended:true}));
server.app.use( express.json());

//FileUpload
server.app.use( fileUpload());

//Configuracion CORS
// server.app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
// });
server.app.use( cors({ origin: true, credentials: true}))

//Rutas de mi aplicación
server.app.use('/user', userRoutes);
server.app.use('/posts', postRoutes);

//Conectar DB
mongoose.connect('mongodb://localhost:27017/artegram', (err) => {
    if(err) throw err;
    console.log('Base de datos ONLINE');                                                            
});

//Levantar express
server.start( () => {
    console.log(`Servidor corriendo en puerto ${server.port}`);
    
} );