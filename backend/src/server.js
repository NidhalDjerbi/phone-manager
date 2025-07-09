import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/database.js";
import { config } from "./config.js";
import phoneRoutes from "./routes/phone.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/phones", phoneRoutes);

app.use(errorHandler);

sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Connexion à PostgreSQL réussie.");
    app.listen(config.port, () => {
      console.log(`🚀 Serveur lancé sur le port ${config.port}`);
    });
  })
  .catch((err) => {
    console.error("❌ Erreur de connexion à PostgreSQL :", err);
  });

process
.on('unhandledRejection', (reason, p) => {
  console.error(reason, 'Unhandled Rejection at Promise', p);
})
.on('uncaughtException', err => {
  console.error(err, 'Uncaught Exception thrown');
  process.exit(1);
});
