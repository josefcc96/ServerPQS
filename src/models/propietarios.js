const mongoose = require('mongoose');
// const Mascotas = require('./mascotas');

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
    mascotas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mascotas' }],
},
{ timestamps: true });

module.exports = mongoose.model('Propietarios', propietariosSchema);
