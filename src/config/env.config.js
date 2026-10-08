import "dotenv/config";

if (!process.env.NODE_ENV || !process.env.PORT) {
    throw new Error("Faltan variables de entorno necesarias: NODE_ENV y PORT");
}

export const envConfig = {
  port: Number(process.env.PORT),
  nodeEnv: process.env.NODE_ENV,
};

console.log(envConfig);