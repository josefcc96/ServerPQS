const express = require('express');
const bcrypt = require('bcrypt');
const cors =require('cors');
const mongoose = require('mongoose');
const jsonwebtoken = require('jsonwebtoken');
const expressJwt = require('express-jwt');

const propietarioValidation = require('./schemas/propietarioSchema');
const loginSchema = require('./schemas/loginSchema');
const Usuarios = require('./models/usuarios');
const {PropietariosModel} = require('./models/propietarios');
const {MascotasModel} = require('./models/mascotas');
const {VacunasModel} = require('./models/vacunas');
const {RazasModel} = require('./models/razas');
const {ComportamientoModel} = require('./models/comportamientos');

require('./db/mongo');

const secretPass = 'QZHa0Ye4v7B4ttCtV6OedhyoLXX0C';

const app = express();
app.use(express.json());
app.use(cors());
app.use(
    expressJwt({
        secret: secretPass,
        algorithms: ['HS256'],
    }).unless({
        path: ['/login'],
    }),
);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json('Token invalido');
    } else {
        res.status(500).json('Internal server error');
    }
});

app.post('/login', async (req, res) => {
    try {
        const {
            email,
            contrasena,
        } = await loginSchema.validateAsync(req.body);

        const {
            contrasena: contrasenaUsuario,
        } = await Usuarios.findOne({ email });
        const resultado = bcrypt.compareSync(contrasena, contrasenaUsuario);
        if (resultado) {
            const user = await Usuarios.findOne({ email },{email:1,nombre:1});
            const token = jsonwebtoken.sign({
                email,
            }, secretPass);
            res.json({ access:token, userInfo:user});
        } else {
            res.status(401).json('Unauthorized');
        }
    } catch (error) {
        res.status(404).json(error);
    }
});

app.post('/propietarios/', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const {
            nombre,
            direccion,
            email,
            telefono,
            cedula,
        } = await propietarioValidation.validateAsync(req.body);
        const propietario = new PropietariosModel({
            nombre: nombre.charAt(0).toUpperCase() + nombre.slice(1),
            direccion,
            email,
            telefono,
            cedula,
        });
        const propietarioCreado = await propietario.save();
        await session.commitTransaction();
        session.endSession();
        res.status(201).json(propietarioCreado);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(404).json(error);
    }
});

app.get('/propietarios/:id', async (req, res) => {
    try {
        const propietario = await PropietariosModel.findById(req.params.id);
        res.json(propietario);
    } catch (error) {
        res.status(404).json(error);
    }
});

app.get('/propietarios/', async (req, res) => {
    try {
        const propietario = await PropietariosModel.find().exec()
        res.json(propietario);
    } catch (error) {
        res.status(404).json(error);
    }
});

app.put('/propietarios/:id', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        await PropietariosModel.findByIdAndUpdate(req.params.id, req.body);
        await session.commitTransaction();
        session.endSession();
        res.sendStatus(204);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(404).json(error);
    }
});

app.get('/mascotas/', async (req, res) => {
    try {
        const mascotas = await MascotasModel.find();
        res.json(mascotas);
    } catch (error) {
        res.status(404).json(error);
    }
});

app.get('/mascotas/:id', async (req, res) => {
    try {
        const mascota = await MascotasModel.findById(req.params.id).exec();
        res.json(mascota);
    } catch (error) {
        res.status(404).json(error);
    }
});

app.post('/mascotas/', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const propietario = await PropietariosModel.findById(req.body.propietario).exec();
        const raza = await RazasModel.findById(req.body.raza).exec();
        const comportamiento = await ComportamientoModel.findById(req.body.comportamiento).exec();

        const mascota = new MascotasModel({
            nombre: req.body.nombre.charAt(0).toUpperCase() + req.body.nombre.slice(1),
            raza,
            fnacimiento: req.body.fnacimiento,
            comportamiento,
            caracFisicas: req.body.caracFisicas,
            fechaDespa: req.body.fechaDespa,
            propietario:{id:propietario.id, nombre:propietario.nombre},
        });
        const mascotaCreada = await mascota.save();

        req.body.vacunas.forEach((vacuna, index) => {
            VacunasModel.findById(vacuna.id).exec().then(async (vacunaN) => {
                mascotaCreada.vacunasAplicadas.push({
                    vacuna: vacunaN,
                    fechaAplicacion: vacuna.fechaAplicacion,
                });
                if (index===req.body.vacunas.length-1){
                    mascotaCreada.save().then(async (mascotacreada1)=>{
                        console.log(mascotacreada1)
                        propietario.mascotas.push(mascotacreada1)
                        await propietario.save()
                    })
                }
                
            });
        });
        
        await session.commitTransaction();
        session.endSession();
        res.status(201).json('Mascota Agregada a la base de datos');
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(404).json(error);
    }
});

app.put('/mascotas/:id', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const propietario = await PropietariosModel.findById(req.body.propietario).exec();
        const raza = await RazasModel.findById(req.body.raza).exec();
        const comportamiento = await ComportamientoModel.findById(req.body.comportamiento).exec();
        const data={
                nombre: req.body.nombre,
                raza: raza,
                fnacimiento: req.body.fnacimiento.split('"')[1],
                comportamiento: comportamiento,
                caracFisicas: req.body.caracFisicas,
                fechaDespa: req.body.fechaDespa.split('"')[1],
                propietario:{
                    id:propietario._id,
                    nombre:propietario.nombre
                },


        }
        // console.log(data)
        await MascotasModel.findByIdAndUpdate(req.params.id, data).exec();
        await propietario.mascotas.forEach( async (mascota,index) => { if (mascota._id){
            propietario.mascotas[index] = await MascotasModel.findById(mascota._id).exec()
        }})
        await PropietariosModel.findByIdAndUpdate(propietario._id, propietario).exec()
        await session.commitTransaction();
        session.endSession();
        res.sendStatus(204);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(404).json(error);
    }
});

app.get('/razas/', async (req, res) => {
    try {
        const razas = await RazasModel.find();
        res.json(razas);
    } catch (error) {
        res.status(404).json(error);
    }
});

app.get('/vacunas/', async (req, res) => {
    try {
        const vacunas = await VacunasModel.find();
        res.json(vacunas);
    } catch (error) {
        res.status(404).json(error);
    }
});

app.get('/comportamientos/', async (req, res) => {
    try {
        const comportamientos = await ComportamientoModel.find();
        res.json(comportamientos);
    } catch (error) {
        res.status(404).json(error);
    }
});

// app.get('/test', (req, res) => {
//     res.json(req.user);
// });

app.listen(3001);

module.exports = app;
