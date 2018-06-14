const express = require('express');
const app = express();

// Cargamos rutas se usuario
app.use(require('./usuario'));
app.use(require('./login'));


module.exports = app;