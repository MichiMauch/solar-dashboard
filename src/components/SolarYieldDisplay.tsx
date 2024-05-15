import React, { useEffect, useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Erweitern des Interfaces
interface SolarYieldData {
  timestamp: number;
  total_solar_yield: number;
  total_consumption: number;
}

// Funktion zum Abrufen der Daten von Ihrer API
const fetchSolarYieldData = async (): Promise<SolarYieldData[]> => {
  const res = await fetch('/api/solarHistory');
  if (!res.ok) {
    throw new Error('Failed to fetch solar yield data');
  }
  const data = await res.json();
  return data;
};

// Funktion zur Formatierung des Datums aus Unix-Zeitstempeln
const formatDate = (timestamp: number): { weekday: string, day: string, month: string } => {
  const date = new Date(timestamp);
  const weekday = date.toLocaleDateString("de-DE", { weekday: 'long' }); // Abkürzung des Wochentags
  const day = date.toLocaleDateString("de-DE", { day: 'numeric' }); // Tag im Monat
  const month = date.toLocaleDateString("de-DE", { month: 'long' }); // Monat als Name

  return { weekday, day, month };
};

// Anpassung der Anzeige in der Komponente
const SolarYieldDisplay: React.FC = () => {
  const [solarYieldData, setSolarYieldData] = useState<SolarYieldData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSolarYieldData().then(data => {
      // Filtert den aktuellen Tag heraus
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const filteredData = data.filter(day => day.timestamp < today.getTime());
      // Sortiert die Daten, sodass das neueste Datum oben ist
      filteredData.sort((a, b) => b.timestamp - a.timestamp);
      setSolarYieldData(filteredData);
      setIsLoading(false);
    }).catch(err => {
      setError(err.message);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="relative flex flex-col text-gray-700 bg-white shadow-md rounded-xl bg-clip-border h-full">
  <div className="flex items-center justify-between p-2 font-sans text-base font-normal text-blue-gray-700 border-b border-gray-300">
    <div className="flex-grow"></div>
    <div className="flex space-x-2">
      <div className="flex-grow text-center">Produktion</div>
      <div className="flex-grow text-center">Verbrauch</div>
    </div>
  </div>
  <nav className="flex min-w-[240px] flex-col gap-1 p-2 font-sans text-base font-normal text-blue-gray-700 overflow-auto">
    {solarYieldData.map((day) => {
      const { weekday, day: dayOfMonth, month } = formatDate(day.timestamp);
      return (
        <div 
          key={day.timestamp} 
          role="button" 
          className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
        >
          <div className="text-m mt-1 flex-grow">{weekday}, {dayOfMonth}. {month}</div>
          <div className="flex space-x-2">
            <div className="relative grid items-center px-2 py-1 font-sans text-xs font-bold text-gray-900 rounded-full select-none whitespace-nowrap bg-yellow-600/50">
              <span className="">{day.total_solar_yield.toFixed(2)} kWh</span>
            </div>
            <div className="relative grid items-center px-2 py-1 font-sans text-xs font-bold text-gray-900 rounded-full select-none whitespace-nowrap bg-blue-600/30">
              <span className="">{day.total_consumption.toFixed(2)} kWh</span>
            </div>
          </div>
        </div>
      );
    })}
  </nav>
</div>


  );
};

export default SolarYieldDisplay;
