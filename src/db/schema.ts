import {
  pgTable, text, boolean, timestamp, float, primaryKey, varchar
} from "drizzle-orm/pg-core";

export const category = pgTable("Category", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull(),
});

export const product = pgTable("Product", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  printfulId: text("printfulId"),
  isActive: boolean("isActive").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull(),
});

export const productCategory = pgTable("ProductCategory", {
  productId: text("productId").notNull(),
  categoryId: text("categoryId").notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.productId, table.categoryId] }),
}));

export const design = pgTable("Design", {
  id: text("id").primaryKey(),
  name: text("name"),
  printfulFileId: text("printfulFileId"),
  previewUrl: text("previewUrl"),
  productId: text("productId").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull(),
});

export const variant = pgTable("Variant", {
  id: text("id").primaryKey(),
  name: text("name"),
  price: float("price").notNull(),
  isActive: boolean("isActive").notNull(),
  productId: text("productId").notNull(),
  printfulVariantId: text("printfulVariantId"),
  size: text("size"),
  color: text("color"),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull(),
});

export const users = pgTable("User", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { withTimezone: true }),
  image: text("image"),
  password: text("password"),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow(),
});

export const accounts = pgTable("Account", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("providerAccountId").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: float("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
});

export const sessions = pgTable("Session", {
  id: text("id").primaryKey(),
  sessionToken: text("sessionToken").notNull().unique(),
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { withTimezone: true }).notNull(),
});

export const verificationTokens = pgTable("VerificationToken", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: timestamp("expires", { withTimezone: true }).notNull(),
}, (vt) => ({
  pk: primaryKey({ columns: [vt.identifier, vt.token] }),
})); 