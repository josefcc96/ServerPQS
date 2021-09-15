const mongoose = require('mongoose');

const vacunasSchema = new mongoose.Schema({
    tipo: {
        type: String,
        required: true,
    },
},
{ timestamps: true });

const vacunasDef = [
    'Parvovirosis',
    'Antirabica',
    'Tos de perrera',
    'Moquillo',
    'Leptospirosis',
];

const VacunasModel = mongoose.model('Vacunas', vacunasSchema);

vacunasDef.forEach((vacuna) => VacunasModel.findOne({ tipo: vacuna })
    .exec()
    .then((vacunaD) => {
        if (!vacunaD) {
            VacunasModel.create({ tipo: vacuna });
        }
    }));

module.exports = VacunasModel;
