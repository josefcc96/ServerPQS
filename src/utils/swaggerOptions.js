const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Veterinaria PQS',
            version: '1.0.0',
            description: 'Prueba Tecnica PQS',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Local server',
            },
        ],
        components: {
            securitySchemes: {
                basicAuth: {
                    type: 'http',
                    scheme: 'basic',
                },
            },
        },
        security: [
            {
                basicAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.js'],
};

module.exports = swaggerOptions;
