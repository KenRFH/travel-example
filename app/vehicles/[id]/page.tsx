import { db } from "@/src/db/drizzle";
import { carTypes, schedules, routes } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import VehicleDetailClient from "./VehicleDetailClient";

interface VehiclePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ scheduleId?: string; date?: string }>;
}

export default async function VehiclePage({ params, searchParams }: VehiclePageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const vehicleId = parseInt(resolvedParams.id, 10);
  const scheduleId = resolvedSearchParams.scheduleId ? parseInt(resolvedSearchParams.scheduleId, 10) : null;
  const travelDate = resolvedSearchParams.date || new Date().toISOString().split("T")[0];

  // Fetch vehicle details from DB
  const carTypeData = await db.select().from(carTypes).where(eq(carTypes.id, vehicleId)).limit(1);
  const carType = carTypeData[0] || null;

  if (!carType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-primary">Kendaraan Tidak Ditemukan</h1>
          <p className="text-on-surface-variant font-medium text-sm">Kembali ke halaman pencarian tiket.</p>
        </div>
      </div>
    );
  }

  // Fetch schedule and route info if scheduleId is provided
  let schedule = null;
  let route = null;

  if (scheduleId) {
    const scheduleData = await db.select().from(schedules).where(eq(schedules.id, scheduleId)).limit(1);
    if (scheduleData.length > 0) {
      schedule = scheduleData[0];
      const routeData = await db.select().from(routes).where(eq(routes.id, schedule.routeId)).limit(1);
      route = routeData[0] || null;
    }
  }

  // Fallback route context if direct path access
  if (!route) {
    const routesList = await db.select().from(routes).limit(1);
    route = routesList[0] || {
      id: 0,
      origin: "Jember",
      destination: "Surabaya",
      price: 150000,
      description: "Jalur Cepat",
      imageUrl: "/images/route-surabaya.jpg",
      tags: "Executive Class",
    };
  }

  return (
    <VehicleDetailClient
      carType={carType}
      schedule={schedule}
      route={route}
      date={travelDate}
    />
  );
}
