import app from "./app.js";
import { envConfig } from "./config/env.config.js";
import { connectDB } from "./config/database.config.js";

async function conectar() {
  await connectDB();

  app.listen(envConfig.port, () => {
    console.log("Servidor corriendo en http://localhost:" + envConfig.port);
  });
}

conectar();
