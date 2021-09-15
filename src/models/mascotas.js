const mongoose = require('mongoose');
const {vacunasSchema}= require('./vacunas');
const {comportamientoSchema} = require('./comportamientos');
const {razasSchema}= require('./razas');

const mascotasSchema = new mongoose.Schema({
    nombre: {
        type: String,
        match: /^[A-Z]+.+/,
        required: true,
    },
    raza: razasSchema,
    fnacimiento: {
        type: Date,
        required: true,
    },
    comportamiento: comportamientoSchema,
    vacunasAplicadas: [
        {
            vacuna:vacunasSchema,
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
const MascotasModel = mongoose.model('Mascotas', mascotasSchema)
module.exports = {MascotasModel,mascotasSchema};
