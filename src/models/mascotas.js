const mongoose = require('mongoose');
// const Vacunas = require('./vacunas');
// const Comportamientos = require('./comportamientos');
// const Raza = require('./razas');

const mascotasSchema = new mongoose.Schema({
    nombre: {
        type: String,
        match: /^[A-Z]+.+/,
        required: true,
    },
    raza: { type: mongoose.Schema.Types.ObjectId, ref: 'Raza' },
    fnacimiento: {
        type: Date,
        required: true,
    },
    comportamiento: { type: mongoose.Schema.Types.ObjectId, ref: 'Comportamientos' },
    vacunasAplicadas: [
        {
            vacuna: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Vacunas',
            },
            fechaAplicacion: {
                type: Date,
                required: true,
            },
        }],
    caracFisicas: {
        type: String,
        required: false,
    },
    fechaDespa: {
        type: Date,
        required: true,
    },
    propietario: { type: mongoose.Schema.Types.ObjectId, ref: 'Propietarios' },
},
{ timestamps: true });

module.exports = mongoose.model('Mascotas', mascotasSchema);
