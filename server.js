import express from "express";
import routes from "./routes/index.js";

const app = express();
const PORT = 5000;

app.use(express.json());

app.use("/api", routes);

app.listen(5000, () => console.log(`server listening on port ${PORT}`));
