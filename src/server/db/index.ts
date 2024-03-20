import { Client } from "@planetscale/database";
// import { drizzle } from "drizzle-orm/planetscale-serverless";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

import { env } from "~/env.mjs";
import * as schema from "./schema";

// planetscale
// export const db = drizzle(
//   new Client({
//     url: env.DATABASE_URL,
//   }).connection(),
//   { schema }
// );

const connection = await mysql.createConnection({
  uri: env.DATABASE_URL
});

export const db = drizzle(connection, { schema, mode: "default" });
