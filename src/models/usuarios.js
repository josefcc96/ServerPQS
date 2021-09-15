const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const usuarioSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    contrasena: {
        type: String,
        required: false,
    },
},
{ timestamps: true });

const UsuariosModel = mongoose.model('Usuario', usuarioSchema);

UsuariosModel.findOne({ email: 'jose.francisco.campo.campo@gmail.com' }).exec().then((admin) => {
    if (!admin) {
        UsuariosModel.create({
            email: 'jose.francisco.campo.campo@gmail.com',
            contrasena: bcrypt.hashSync('Jose1234', 10),
        });
    }
});

module.exports = UsuariosModel;
