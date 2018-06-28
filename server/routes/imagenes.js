const express = require('express');
//const fileUpload = require('express-fileupload');
const app = express();


//const Usuario = require('../models/usuario');
//const Producto = require('../models/producto');


const fs = require('fs'); //Manejos de archivos en node
const path = require('path'); //Manejo de rutas en node

const { verificaToken, verificaAdmin_role, verificaTokenImg } = require('../middleware/autenticacion');


const folderFiles = 'uploads';


app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;


    let pathImagen = path.resolve(__dirname, `../../${folderFiles}/${tipo}/${img}`);
    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImagePath);
    }



});



module.exports = app;