require('./config/config');

const express = require('express');


const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


// configuración de rutas
app.use(require('./routes/index'));

// Conectamos con la base de datos
mongoose.connect(process.env.URLDB, (err, res) => {

    if (err) throw err;

    console.log('Base de datos ONLINE.');
});



app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto:', process.env.PORT);
});