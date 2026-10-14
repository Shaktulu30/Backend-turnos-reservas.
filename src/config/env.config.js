import "dotenv/config";

if (!process.env.NODE_ENV || !process.env.PORT || !process.env.MONGO_URI) {
    throw new Error("Faltan variables de entorno necesarias: NODE_ENV, PORT y MONGO_URI");
}

export const envConfig = {
  port: Number(process.env.PORT),
  nodeEnv: process.env.NODE_ENV,
  mongoUri: process.env.MONGO_URI,
};