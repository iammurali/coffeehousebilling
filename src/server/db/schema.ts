// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  bigint,
  decimal,
  mysqlEnum,
  mysqlTableCreator,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = mysqlTableCreator((name) => `edaikazhinaducoffeehouse_${name}`);

export const users = mysqlTable(
  "users",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    name: varchar("name", { length: 256 }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (example) => ({
    nameIndex: uniqueIndex("name_idx").on(example.name),
  })
);

export const menuItem = mysqlTable(
  "menu_items",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    title: varchar("title", { length: 256 }),
    description: varchar("description", { length: 256 }),
    category: varchar("category", { length: 256 }),
    price: decimal("price", { precision: 10, scale: 2 }),
    isActive: mysqlEnum("isActive", ["true", "false"]).default("true"),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (example) => ({
    titleIndex: uniqueIndex("title_idx").on(example.title),
  })
);


