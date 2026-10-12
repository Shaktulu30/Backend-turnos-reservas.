import app from "./app.js";
import { envConfig } from "./config/env.config.js";

app.listen(envConfig.port, () => {
  console.log("Servidor corriendo en http://localhost:" + envConfig.port);
});