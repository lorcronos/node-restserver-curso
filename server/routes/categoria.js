const express = require('express');

//const bcrypt = require('bcrypt');

const _ = require('underscore');

const { verificaToken, verificaAdmin_role } = require('../middleware/autenticacion');

const app = express();

const Categoria = require('../models/categoria'); //Modelo de datos

// ================================================
// Mostrar todas las categorias
// ================================================
app.get('/categoria', verificaToken, (req, res) => {

    // Variables de paginación
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    let filtro = {};

    Categoria.find(filtro, '')
        .sort('descripcion')
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Categoria.count(filtro, (err, conteo) => {
                res.json({
                    ok: true,
                    cuantos: conteo,
                    categorias
                });
            });
        })
});

// ================================================
// Crear una categorias
// ================================================
app.post('/categoria', [verificaToken, verificaAdmin_role], (req, res) => {

    /* return res.json({
        usuario: req.usuario,
        body: req.body
    }); */

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) { // No se ha credo la categoria
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// ================================================
// Mostrar una categoria por ID
// ================================================

app.get('/categoria/:id', verificaToken, (req, res) => {

    /* return res.json({
        usuario: req.usuario,
        id: req.params.id
    }); */

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) { // No se ha modificado la categoria
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no es válido.'
                }
            });
        }


        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
});

// ================================================
// Modificar una categoria por ID
// ================================================

app.put('/categoria/:id', [verificaToken, verificaAdmin_role], (req, res) => {

    /* return res.json({
        usuario: req.usuario,
        id: req.params.id,
        body: req.body
    }); */

    let id = req.params.id;
    //let body = _.pick(req.body, ['descripcion']);
    let descCategoria = {
        descripcion: req.body.descripcion
    }

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) { // No se ha modificado la categoria
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
});

// ================================================
// Eliminar una categoria por ID
// ================================================

app.delete('/categoria/:id', [verificaToken, verificaAdmin_role], (req, res) => {

    /* return res.json({
        usuario: req.usuario,
        id: req.params.id
    }); */

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBorrada
        });

    });
});

module.exports = app;