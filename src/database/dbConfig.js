import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../../prisma/generated/client/client.ts";

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "db_penjualan_toko",
  connectionLimit: 5,
});

const prismaClient = new PrismaClient({
  adapter,
});

export { prismaClient };