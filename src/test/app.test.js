/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');
const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Usuario = require('../models/usuarios');
const app = require('../index');

chai.should();
chai.use(chaiHttp);

describe('Registro de usuario', () => {
    let token;
    before(async () => {
        const usuario = new Usuario({
            nombre: 'test',
            apellido: 'test',
            email: 'test@test.co',
            contrasena: bcrypt.hashSync('contrasena', 10),
        });
        await usuario.save();
        token = jsonwebtoken.sign({
            email: 'test@test.co',
            esAdministrador: false,
        }, 'QZHa0Ye4v7B4ttCtV6OedhyoLXX0C');
    });

    after(async () => {
        await Usuario.deleteOne({ email: 'test@test.co' });
    });

    describe('POST /registrar de forma exitosa', () => {
        it('debe devolver un 200 en status', (done) => {
            const usuario = {
                nombre: 'test',
                apellido: 'test',
                email: 'test@test.com',
                contrasena: 'test',
                repetir_contrasena: 'test',
            };
            chai.request(app)
                .post('/registrar')
                .send(usuario)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.an('object');
                    done();
                });
        });

        after(async () => {
            await Usuario.deleteOne({ email: 'test@test.com' });
        });
    });

    describe('POST /registrar de forma fallida el body', () => {
        it('debe devolver un 404 en status porque el nombre tiene menos de 3 caracteres', (done) => {
            const usuario = {
                nombre: 't',
                apellido: 'test',
                email: 'test@test.com',
                contrasena: 'test',
                repetir_contrasena: 'test',
            };
            chai.request(app)
                .post('/registrar')
                .send(usuario)
                .end((err, response) => {
                    response.should.have.status(404);
                    done();
                });
        });

        it('debe devolver un 404 en status porque el apellido tiene menos de 3 caracteres', (done) => {
            const usuario = {
                nombre: 'test',
                apellido: 't',
                email: 'test@test.com',
                contrasena: 'test',
                repetir_contrasena: 'test',
            };
            chai.request(app)
                .post('/registrar')
                .send(usuario)
                .end((err, response) => {
                    response.should.have.status(404);
                    done();
                });
        });

        it('debe devolver un 404 en status porque el email no es .com .co o .net', (done) => {
            const usuario = {
                nombre: 'test',
                apellido: 't',
                email: 'test@test.org',
                contrasena: 'test',
                repetir_contrasena: 'test',
            };
            chai.request(app)
                .post('/registrar')
                .send(usuario)
                .end((err, response) => {
                    response.should.have.status(404);
                    done();
                });
        });

        it('debe devolver un 404 en status porque no coincide las contrasenas', (done) => {
            const usuario = {
                nombre: 'test',
                apellido: 't',
                email: 'test@test.org',
                contrasena: 'test',
                repetir_contrasena: 'test1234',
            };
            chai.request(app)
                .post('/registrar')
                .send(usuario)
                .end((err, response) => {
                    response.should.have.status(404);
                    done();
                });
        });
    });

    describe('GET /test debe devolver un objeto cuando se pasa un token valido', () => {
        it('debe devolver el objeto user del token', (done) => {
            chai.request(app)
                .get(`/test/${id}`)
                .set({ Authorization: `Bearer ${token}` })
                .end((err, response) => {
                    response.should.have.status(200);
                    response.should.be.an('object');
                    done();
                });
        });
    });
});
