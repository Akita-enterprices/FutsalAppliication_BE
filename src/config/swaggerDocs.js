const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Futsal API Documentation",
      version: "1.0.0",
      description: "API documentation for the Futsal Application project",
    },
    servers: [
      {
        url: "http://localhost:4000", // Update with your backend URL
      },
    ],
  },
  apis: ["./swagger/*.js"], // Importing documentation from another folder
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
console.log("Swagger Docs available at: http://localhost:4000/api-docs");

module.exports = { swaggerUi, swaggerDocs };
