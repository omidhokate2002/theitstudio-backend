import express from "express";
import cors from "cors";
import "dotenv/config";
import "./db/config.js";
import personRoutes from "./routes/personRoutes.js";

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors("*"));

app.use("/api/person", personRoutes);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
