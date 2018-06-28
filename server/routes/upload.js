const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();


const Usuario = require('../models/usuario');
const Producto = require('../models/producto');


const fs = require('fs'); //Manejos de archivos en node
const path = require('path'); //Manejo de rutas en node

const folderFiles = 'uploads';

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se han enviado archivos.'
                }
            });
    }

    // Validar tipos
    let tiposValidos = ['usuarios', 'productos'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las tipos permitidos son: ' + tiposValidos.join(', ')
            }
        });
    }



    let archivo = req.files.archivo;
    let partesArchivo = archivo.name.split('.');
    let extension = partesArchivo[partesArchivo.length - 1];

    // Extensiones permitidas
    let extensionesValidas = ['jpg', 'gif', 'png', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son: ' + extensionesValidas.join(', ')
            }
        });
    }

    // Cambiar nombre al archivo
    let nombreArchivo = `${id}-${ new Date().getMilliseconds() }.${extension}`

    archivo.mv(`${folderFiles}/${tipo}/${nombreArchivo}`, (err) => {

        if (err) {
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        }

        // La imagen ya se ha cargado
        if (tipo === "usuarios") {
            imagenUsuario(id, res, nombreArchivo, tipo);
        } else {
            imagenProducto(id, res, nombreArchivo, tipo);
        }


        /* res.json({
            ok: true,
            message: 'Archivo subido correctamente.'
        }); */
    });
});

function imagenUsuario(id, res, nombreArchivo, tipo) {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            borraArchivo(nombreArchivo, tipo);
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            borraArchivo(nombreArchivo, tipo);
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe.'
                }
            });
        }

        borraArchivo(usuarioDB.img, tipo);

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        });


    })
}

function imagenProducto(id, res, nombreArchivo, tipo) {

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            borraArchivo(nombreArchivo, tipo);
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borraArchivo(nombreArchivo, tipo);
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe.'
                }
            });
        }

        borraArchivo(productoDB.img, tipo);

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });
        });


    })
}

function borraArchivo(nombreArchivo, tipo) {
    let pathImagen = path.resolve(__dirname, `../../${folderFiles}/${tipo}/${nombreArchivo}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;