const mongoose = require('mongoose');

const razasSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
},
{ timestamps: true });

const RazasD = [
    'Criollo',
    'Rottweiler',
    'Beagle',
    'Poodle',
    'Bulldog',
    'Bulldog Frances',
    'Golden retriever',
];

const RazasModel = mongoose.model('Razas', razasSchema);

RazasD.forEach((raza) => RazasModel.findOne({ nombre: raza })
    .exec()
    .then((razaD) => {
        if (!razaD) {
            RazasModel.create({ nombre: raza });
        }
    }));

module.exports = {RazasModel,razasSchema};
