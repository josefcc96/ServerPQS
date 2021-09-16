const mongoose = require('mongoose');
const {mascotasSchema} = require('./mascotas');

const propietariosSchema = new mongoose.Schema({
    nombre: {
        type: String,
        match: /^[A-Z]+.+/,
        required: true,
    },
    direccion: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    telefono: {
        type: String,
        required: true,
    },
    cedula: {
        type: String,
        required: false,
    },
    mascotas: [mascotasSchema],
},
{ timestamps: true });
const PropietariosModel = mongoose.model('Propietarios', propietariosSchema);

module.exports = {PropietariosModel,propietariosSchema}