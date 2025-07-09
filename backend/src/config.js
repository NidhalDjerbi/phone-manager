import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 5000,
  databaseUrl: process.env.DATABASE_URL,
};
