import React, { useEffect, useState } from 'react';
import NumberIcons from '../utils/NumberIcons';
import '@fortawesome/fontawesome-free/css/all.min.css';



// Definition der Schnittstelle fÃ¼r die Daten
interface SolarYieldData {
  timestamp: number;
  total_solar_yield: number;
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
  const weekday = date.toLocaleDateString("de-DE", { weekday: 'long' }); // AbkÃ¼rzung des Wochentags
  const day = date.toLocaleDateString("de-DE", { day: 'numeric' }); // Tag im Monat
  const month = date.toLocaleDateString("de-DE", { month: 'long' }); // Monat als Name

  return { weekday, day, month };
};


// Ihre React-Komponente zur Anzeige der SolarertrÃ¤ge
const SolarYieldDisplay: React.FC = () => {
  const [solarYieldData, setSolarYieldData] = useState<SolarYieldData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSolarYieldData().then(data => {
      setSolarYieldData(data);
      setIsLoading(false);
    }).catch(err => {
      setError(err.message);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Berechnen des letzten Monatsnamens fÃ¼r die Anzeige
  const lastMonthName = solarYieldData.length ? new Date(solarYieldData[solarYieldData.length - 1].timestamp).toLocaleDateString("de-DE", { month: 'long', year: 'numeric' }) : "";


  return (
    <div className="relative flex flex-col text-gray-700 bg-white shadow-md w-96 rounded-xl bg-clip-border">
      <nav className="flex min-w-[240px] flex-col gap-1 p-2 font-sans text-base font-normal text-blue-gray-700">
        {solarYieldData.map((day) => {
          const { weekday, day: dayOfMonth } = formatDate(day.timestamp);
          return (
            <div 
              key={day.timestamp} 
              role="button" 
              className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
            >
              <div className="text-m mt-1">{weekday}, {dayOfMonth}. {lastMonthName}</div> 
              <div className="grid ml-auto place-items-center justify-self-end">
                <div className="relative grid items-center px-2 py-1 font-sans text-xs font-bold text-gray-900 rounded-full select-none whitespace-nowrap bg-green-600/30">
                  <span className="">{day.total_solar_yield.toFixed(2)} kWh</span>
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
  