import { drizzle } from "drizzle-orm/libsql";
import { client } from "./index";

export const db = drizzle(client);