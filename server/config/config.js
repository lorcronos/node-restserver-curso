// ====================================
// Puerto
// ====================================

process.env.PORT = process.env.PORT || 3000;


// ====================================
// Entorno
// ====================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ====================================
// Base de Datos
// ====================================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

// ====================================
// Vencimiento del token
// ====================================
// 60 segundos
// 60 minutos
// 24 horas
// 30 días

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// ====================================
// SEED de autenticación
// ====================================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// ====================================
// google Client ID
// ====================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '233244630947-iltcels7a7lcn6bkdj2pc8v01i2arn14.apps.googleusercontent.com';