import { searchSchedules } from "@/app/actions/admin";
import SearchContent from "./SearchContent";

interface SearchPageProps {
  searchParams: Promise<{
    from?: string;
    to?: string;
    date?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  
  const fromCity = params.from || "Jember";
  const toCity = params.to || "Surabaya";
  const date = params.date || new Date().toISOString().split("T")[0];

  // Query database schedules matching the searched route
  const schedules = await searchSchedules(fromCity, toCity);

  return (
    <SearchContent
      initialSchedules={schedules}
      fromCity={fromCity}
      toCity={toCity}
      date={date}
    />
  );
}
