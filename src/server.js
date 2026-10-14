import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { envConfig } from "./config/env.config.js";
import { connectDB } from "./config/database.config.js";

const httpServer = createServer(app);
const io = new Server(httpServer);

app.set("io", io);

io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);
});

async function conectar() {
  await connectDB();

  httpServer.listen(envConfig.port, () => {
    console.log("Servidor corriendo en http://localhost:" + envConfig.port);
  });
}

conectar();