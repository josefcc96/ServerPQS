const mongoose = require('mongoose');

const comportamientoSchema = new mongoose.Schema({
    comportamiento: {
        type: String,
        required: true,
    },
},
{ timestamps: true });
const ComportamientoModel = mongoose.model('Comportamiento', comportamientoSchema);
const ComportamientosD = [
    'Agresivo',
    'Sociable',
    'Ansioso ',
    'Nervioso',
    'Amigable',
];

ComportamientosD.forEach((comportamiento) => ComportamientoModel.findOne({ comportamiento })
    .exec()
    .then((comportamientoD) => {
        if (!comportamientoD) {
            ComportamientoModel.create({ comportamiento });
        }
    }));

module.exports = ComportamientoModel;
