import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
});

export const admins = sqliteTable("admins", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const carTypes = sqliteTable("car_types", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  capacity: integer("capacity").notNull(),
  facility: text("facility").notNull(), // comma separated, e.g., "AC, Charger, Snack"
});

export const routes = sqliteTable("routes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  price: integer("price").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  tags: text("tags").notNull(), // comma separated, e.g., "Executive Class, Door-to-Door"
});

export const schedules = sqliteTable("schedules", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  routeId: integer("route_id")
    .notNull()
    .references(() => routes.id, { onDelete: "cascade" }),
  carTypeId: integer("car_type_id")
    .notNull()
    .references(() => carTypes.id, { onDelete: "cascade" }),
  departureTime: text("departure_time").notNull(), // e.g. "08:00"
  availableSeats: integer("available_seats").notNull(),
});