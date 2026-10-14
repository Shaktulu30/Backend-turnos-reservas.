import mongoose from "mongoose";
import { envConfig } from "./env.config.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(envConfig.mongoUri);
    console.log("Conexión a MongoDB exitosa");
  } catch (error) {
    console.error("Error al conectar con MongoDB:", error.message);
    process.exit(1);
  }
};