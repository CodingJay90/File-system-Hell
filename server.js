import express from "express";
import routes from "./routes/index.js";
import swaggerUi from "swagger-ui-express";
// import swaggerDocument from "./swagger.json";
import swaggerDefinition from "./swagger-definition.js";
import swaggerJsdoc from "swagger-jsdoc";

const app = express();
const PORT = 5000;

//Swagger init
const swaggerJsdocOptions = {
  definition: swaggerDefinition,
  apis: ["./routes/*.js"],
};
const specs = swaggerJsdoc(swaggerJsdocOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(express.json());

app.use("/api", routes);

app.listen(5000, () => console.log(`server listening on port ${PORT}`));
