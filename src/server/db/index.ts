import { Client } from "@planetscale/database";
import { MySql2Database, drizzle } from "drizzle-orm/mysql2";

import { env } from "~/env.mjs";
import * as schema from "./schema";

import mysql from "mysql2/promise";

const connection: mysql.Connection = await mysql.createConnection(env.DATABASE_URL);
export const db = drizzle(connection, {schema, mode:'planetscale'});
