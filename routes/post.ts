import { Response, Router } from "express";
import FileSystem from "../classes/file-system";
import { FileUpload } from "../interfaces/file-upload";
import { verificaToken } from '../middlewares/autenticacion';
import { Post } from '../models/post.model';


const postRoutes = Router();
const fileSystem = new FileSystem();


//Obtener Post paginados
postRoutes.get('/',  async (req: any, res: Response) => {

    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;

    const posts = await Post.find().sort({_id: -1}).skip(skip).limit(10).populate('usuario','-password').exec();

    res.json({
        ok: true,
        pagina,
        posts
    });
});


//Servicios para subir acrhivos
postRoutes.post('/upload', [verificaToken], async (req: any, res: Response) => {

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensajes: 'No se subió ningun archivo'
        });
    }

    const file: FileUpload = req.files.image;

    if (!file) {
        return res.status(400).json({
            ok: false,
            mensajes: 'No se subió ningun archivo - image'
        });
    }

    if(!file.mimetype.includes('image')){
        return res.status(400).json({
            ok: false,
            mensajes: 'No se subió ninguna imagen'
        });
    }

    await fileSystem.guardaImagenTemporal(file, req.usuario._id);

    res.json({
        ok: true,
        file: file.mimetype
    });

});


//Crear POST
postRoutes.post('/', [verificaToken], (req: any, res: Response) => {
    
    const body = req.body;
    body.usuario = req.usuario._id;

    const imagenes = fileSystem.imagenesDeTempAPost( req.usuario._id);
    body.img = imagenes;

    Post.create(body).then( async postDB => {

        await postDB.populate('usuario','-password');

        res.json({
            ok: true,
            post: postDB
        });
    }).catch( err => {
        err.json(err);
    });

   
});


postRoutes.get('/imagen/:userid/:img', (req: any, res: Response) => {

    const userId = req.params.userid;
    const img = req.params.img;

    const pathFoto = fileSystem.getFotoURL(userId,img);

    res.sendFile( pathFoto);

});

export default postRoutes;