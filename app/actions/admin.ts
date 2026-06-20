"use server";

import { db } from "@/src/db/drizzle";
import { admins, carTypes, routes, schedules, companyContents } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { seedDatabase } from "@/src/db/seed";

// Helper: Ensure DB is seeded when hit
async function ensureDbSeeded() {
  await seedDatabase();
}

// ----------------- Auth Actions -----------------

export async function loginAdmin(formData: FormData) {
  await ensureDbSeeded();
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { success: false, error: "Username and password are required" };
  }

  try {
    const adminUser = await db
      .select()
      .from(admins)
      .where(eq(admins.username, username))
      .limit(1);

    if (adminUser.length === 0 || adminUser[0].password !== password) {
      return { success: false, error: "Invalid username or password" };
    }

    // Set secure HTTP-only cookie (async in modern Next.js)
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 12, // 12 hours
      path: "/",
    });

    return { success: true };
  } catch (error) {
    console.error("Admin login error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  return { success: true };
}

export async function checkAuth() {
  const cookieStore = await cookies();
  return cookieStore.has("admin_session");
}

// ----------------- Routes CRUD Actions -----------------

export async function getRoutes() {
  await ensureDbSeeded();
  try {
    const rawRoutes = await db.select().from(routes);
    const rawSchedules = await db.select().from(schedules);
    const rawCarTypes = await db.select().from(carTypes);

    return rawRoutes.map((r) => {
      const sched = rawSchedules.find((s) => s.routeId === r.id);
      const car = sched ? rawCarTypes.find((c) => c.id === sched.carTypeId) : null;
      return {
        ...r,
        departureTime: sched?.departureTime || "",
        carTypeId: sched?.carTypeId || null,
        vehicleName: car?.name || "",
        scheduleId: sched?.id || null,
      };
    });
  } catch (error) {
    console.error("Error fetching routes:", error);
    return [];
  }
}

export async function createRoute(data: {
  origin: string;
  destination: string;
  price: number;
  description: string;
  imageUrl: string;
  tags: string;
  departureTime?: string;
  carTypeId?: number;
}) {
  try {
    const newRoute = await db.insert(routes).values({
      origin: data.origin,
      destination: data.destination,
      price: data.price,
      description: data.description,
      imageUrl: data.imageUrl,
      tags: data.tags,
    }).returning();

    const createdRoute = newRoute[0];

    if (createdRoute && data.departureTime && data.carTypeId) {
      const car = await db.select().from(carTypes).where(eq(carTypes.id, data.carTypeId)).limit(1);
      const capacity = car[0]?.capacity || 10;

      await db.insert(schedules).values({
        routeId: createdRoute.id,
        carTypeId: data.carTypeId,
        departureTime: data.departureTime,
        availableSeats: capacity,
      });
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error creating route:", error);
    return { success: false, error: error.message || "Failed to create route" };
  }
}

export async function updateRoute(
  id: number,
  data: {
    origin: string;
    destination: string;
    price: number;
    description: string;
    imageUrl: string;
    tags: string;
    departureTime?: string;
    carTypeId?: number;
  }
) {
  try {
    await db.update(routes).set({
      origin: data.origin,
      destination: data.destination,
      price: data.price,
      description: data.description,
      imageUrl: data.imageUrl,
      tags: data.tags,
    }).where(eq(routes.id, id));

    if (data.departureTime && data.carTypeId) {
      const car = await db.select().from(carTypes).where(eq(carTypes.id, data.carTypeId)).limit(1);
      const capacity = car[0]?.capacity || 10;

      const existingSchedules = await db.select().from(schedules).where(eq(schedules.routeId, id)).limit(1);
      if (existingSchedules.length > 0) {
        await db.update(schedules).set({
          carTypeId: data.carTypeId,
          departureTime: data.departureTime,
          availableSeats: capacity,
        }).where(eq(schedules.id, existingSchedules[0].id));
      } else {
        await db.insert(schedules).values({
          routeId: id,
          carTypeId: data.carTypeId,
          departureTime: data.departureTime,
          availableSeats: capacity,
        });
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error updating route:", error);
    return { success: false, error: error.message || "Failed to update route" };
  }
}

export async function deleteRoute(id: number) {
  try {
    await db.delete(routes).where(eq(routes.id, id));
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting route:", error);
    return { success: false, error: error.message || "Failed to delete route" };
  }
}

// ----------------- Car Types CRUD Actions -----------------

export async function getCarTypes() {
  await ensureDbSeeded();
  try {
    return await db.select().from(carTypes);
  } catch (error) {
    console.error("Error fetching car types:", error);
    return [];
  }
}

export async function createCarType(data: {
  name: string;
  capacity: number;
  facility: string;
}) {
  try {
    await db.insert(carTypes).values(data);
    return { success: true };
  } catch (error: any) {
    console.error("Error creating car type:", error);
    return { success: false, error: error.message || "Failed to create vehicle" };
  }
}

export async function updateCarType(
  id: number,
  data: {
    name: string;
    capacity: number;
    facility: string;
  }
) {
  try {
    await db.update(carTypes).set(data).where(eq(carTypes.id, id));
    return { success: true };
  } catch (error: any) {
    console.error("Error updating car type:", error);
    return { success: false, error: error.message || "Failed to update vehicle" };
  }
}

export async function deleteCarType(id: number) {
  try {
    await db.delete(carTypes).where(eq(carTypes.id, id));
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting car type:", error);
    return { success: false, error: error.message || "Failed to delete vehicle" };
  }
}

// ----------------- Schedules CRUD Actions -----------------

export async function getSchedules() {
  await ensureDbSeeded();
  try {
    // Return schedules joined with routes and carTypes
    const rawSchedules = await db.select().from(schedules);
    const dbRoutes = await db.select().from(routes);
    const dbCarTypes = await db.select().from(carTypes);

    return rawSchedules.map((s) => {
      const route = dbRoutes.find((r) => r.id === s.routeId);
      const carType = dbCarTypes.find((c) => c.id === s.carTypeId);
      return {
        ...s,
        route: route || null,
        carType: carType || null,
      };
    });
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return [];
  }
}

export async function createSchedule(data: {
  routeId: number;
  carTypeId: number;
  departureTime: string;
  availableSeats: number;
}) {
  try {
    await db.insert(schedules).values(data);
    return { success: true };
  } catch (error: any) {
    console.error("Error creating schedule:", error);
    return { success: false, error: error.message || "Failed to create schedule" };
  }
}

export async function updateSchedule(
  id: number,
  data: {
    routeId: number;
    carTypeId: number;
    departureTime: string;
    availableSeats: number;
  }
) {
  try {
    await db.update(schedules).set(data).where(eq(schedules.id, id));
    return { success: true };
  } catch (error: any) {
    console.error("Error updating schedule:", error);
    return { success: false, error: error.message || "Failed to update schedule" };
  }
}

export async function deleteSchedule(id: number) {
  try {
    await db.delete(schedules).where(eq(schedules.id, id));
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting schedule:", error);
    return { success: false, error: error.message || "Failed to delete schedule" };
  }
}

// ----------------- Public Search Actions -----------------

export async function getDistinctCities() {
  await ensureDbSeeded();
  try {
    const data = await db.select().from(routes);
    const origins = Array.from(new Set(data.map((r) => r.origin.trim())));
    const destinations = Array.from(new Set(data.map((r) => r.destination.trim())));
    return { origins, destinations };
  } catch (error) {
    console.error("Error getting distinct cities:", error);
    return { origins: ["Jember"], destinations: ["Surabaya", "Malang", "Banyuwangi"] };
  }
}

export async function searchSchedules(from: string, to: string) {
  await ensureDbSeeded();
  try {
    const dbRoutes = await db.select().from(routes);
    const dbCarTypes = await db.select().from(carTypes);
    const rawSchedules = await db.select().from(schedules);

    // Find route matches (case-insensitive)
    const matchingRoutes = dbRoutes.filter(
      (r) =>
        r.origin.toLowerCase().trim() === from.toLowerCase().trim() &&
        r.destination.toLowerCase().trim() === to.toLowerCase().trim()
    );

    if (matchingRoutes.length === 0) {
      return [];
    }

    const routeIds = matchingRoutes.map((r) => r.id);
    const filteredSchedules = rawSchedules.filter((s) => routeIds.includes(s.routeId));

    return filteredSchedules.map((s) => {
      const route = dbRoutes.find((r) => r.id === s.routeId);
      const carType = dbCarTypes.find((c) => c.id === s.carTypeId);
      return {
        id: s.id,
        routeId: s.routeId,
        carTypeId: s.carTypeId,
        departureTime: s.departureTime,
        availableSeats: s.availableSeats,
        route: route ? {
          id: route.id,
          origin: route.origin,
          destination: route.destination,
          price: route.price,
          description: route.description,
          imageUrl: route.imageUrl,
          tags: route.tags
        } : null,
        carType: carType ? {
          id: carType.id,
          name: carType.name,
          capacity: carType.capacity,
          facility: carType.facility
        } : null
      };
    });
  } catch (error) {
    console.error("Error searching schedules:", error);
    return [];
  }
}

// ----------------- Company Contents Actions -----------------

export async function getCompanyContent(key: string) {
  await ensureDbSeeded();
  try {
    const data = await db
      .select()
      .from(companyContents)
      .where(eq(companyContents.key, key))
      .limit(1);

    if (data.length === 0) {
      return null;
    }
    return {
      key: data[0].key,
      contentId: JSON.parse(data[0].contentId),
      contentEn: JSON.parse(data[0].contentEn),
    };
  } catch (error) {
    console.error(`Error fetching company content for ${key}:`, error);
    return null;
  }
}

export async function updateCompanyContent(key: string, contentId: any, contentEn: any) {
  await ensureDbSeeded();
  try {
    const existing = await db
      .select()
      .from(companyContents)
      .where(eq(companyContents.key, key))
      .limit(1);

    const strContentId = typeof contentId === "string" ? contentId : JSON.stringify(contentId);
    const strContentEn = typeof contentEn === "string" ? contentEn : JSON.stringify(contentEn);

    if (existing.length > 0) {
      await db
        .update(companyContents)
        .set({
          contentId: strContentId,
          contentEn: strContentEn,
        })
        .where(eq(companyContents.key, key));
    } else {
      await db.insert(companyContents).values({
        key,
        contentId: strContentId,
        contentEn: strContentEn,
      });
    }

    return { success: true };
  } catch (error: any) {
    console.error(`Error updating company content for ${key}:`, error);
    return { success: false, error: error.message || "Failed to update page content" };
  }
}
