const jwt = require('jsonwebtoken');

// ====================================
// Verifica Token
// ====================================

let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido.'
                }
            });
        }

        req.usuario = decoded.usuario;

        next();
    });

    /* res.json({
        token: token
    }); */

};

// ====================================
// Verifica AdminRole
// ====================================

let verificaAdmin_role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: true,
            err: {
                message: 'El usuario no es administrador.'
            }
        });
    }
};

// ====================================
// Verifica Token para imagen
// ====================================

let verificaTokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido.'
                }
            });
        }

        req.usuario = decoded.usuario;

        next();
    });

};


module.exports = {
    verificaToken,
    verificaAdmin_role,
    verificaTokenImg
}