const express = require('express');

const _ = require('underscore');

const { verificaToken, verificaAdmin_role } = require('../middleware/autenticacion');

const app = express();

const ruta = 'producto';

const Producto = require(`../models/${ruta}`); //Modelo de datos


// ================================================
// Crear un producto
// ================================================
app.post(`/${ruta}`, [verificaToken, verificaAdmin_role], (req, res) => {

    /* return res.json({
        usuario: req.usuario,
        nombre: req.usuario.nombre,
        email: req.usuario.email
    }); */

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });

    });

});

// ================================================
// Mostrar todos los producto
// ================================================
app.get(`/${ruta}`, verificaToken, (req, res) => {

    // Variables de paginación
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    let filtro = { disponible: true };

    Producto.find(filtro, '')
        .sort('descripcion')
        .skip(desde)
        .limit(limite)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Producto.count(filtro, (err, conteo) => {
                res.json({
                    ok: true,
                    cuantos: conteo,
                    productos
                });
            });
        })
});

// ================================================
// Mostrar un producto por ID
// ================================================
app.get(`/${ruta}/:id`, verificaToken, (req, res) => {

    /* return res.json({
        usuario: req.usuario,
        id: req.params.id
    }); */

    let id = req.params.id;

    // Variables de paginación
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    let filtro = { _id: id, disponible: true };

    Producto.find(filtro, '')
        .sort('descripcion')
        .skip(desde)
        .limit(limite)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productos) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El producto no existe.'
                    }
                });
            }

            Producto.count(filtro, (err, conteo) => {
                res.json({
                    ok: true,
                    cuantos: conteo,
                    productos
                });
            });
        })
});

// ================================================
// Buscar productos
// ================================================
app.get(`/${ruta}/buscar/:termino`, verificaToken, (req, res) => {

    /* return res.json({
        usuario: req.usuario,
        id: req.params.id
    }); */

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    // Variables de paginación
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    let filtro = { nombre: regex };

    Producto.find(filtro)
        .sort('descripcion')
        .skip(desde)
        .limit(limite)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productos) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El producto no existe.'
                    }
                });
            }

            Producto.count(filtro, (err, conteo) => {
                res.json({
                    ok: true,
                    cuantos: conteo,
                    productos
                });
            });
        })
});


// ================================================
// Modifica un producto
// ================================================
app.put(`/${ruta}/:id`, [verificaToken, verificaAdmin_role], (req, res) => {

    /* return res.json({
        usuario: req.usuario,
        nombre: req.usuario.nombre,
        email: req.usuario.email
    }); */

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'categoria', 'disponible']);

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) { // No se ha modificado la categoria
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe.'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    });


});

// ================================================
// Modifica un producto
// ================================================
app.delete(`/${ruta}/:id`, [verificaToken, verificaAdmin_role], (req, res) => {

    /* return res.json({
        usuario: req.usuario,
    }); */

    let id = req.params.id;

    let cambiaDisponible = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, cambiaDisponible, { new: true }, (err, productoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });

        }

        res.json({
            ok: true,
            message: 'Producto no disponible',
            producto: productoBorrado
        });

    });

});


module.exports = app;