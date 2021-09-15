const joi = require('joi');

const propietarioValidation = joi.object({
    nombre: joi
        .string()
        .min(3)
        .required(),
    direccion: joi
        .string()
        .min(3)
        .max(30)
        .required(),
    email: joi.string()
        .email({
            minDomainSegments: 2,
            tlds: { allow: ['com', 'net', 'co'] },
        }),
    telefono: joi
        .number()
        .required(),
    cedula: joi
        .number(),
});

module.exports = propietarioValidation;
