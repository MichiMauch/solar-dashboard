import React, { useEffect, useState } from 'react';
import NumberIcons from '../utils/NumberIcons';
import '@fortawesome/fontawesome-free/css/all.min.css';



// Definition der Schnittstelle für die Daten
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
const formatDate = (timestamp: number): { weekday: string, day: string } => {
  const date = new Date(timestamp);
  const weekday = date.toLocaleDateString("de-DE", { weekday: 'short' }); // Abkürzung des Wochentags
  const day = date.toLocaleDateString("de-DE", { day: 'numeric' }); // Tag im Monat
  return { weekday, day };
};


// Ihre React-Komponente zur Anzeige der Solarerträge
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

  // Berechnen des letzten Monatsnamens für die Anzeige
  const lastMonthName = solarYieldData.length ? new Date(solarYieldData[solarYieldData.length - 1].timestamp).toLocaleDateString("de-DE", { month: 'long', year: 'numeric' }) : "";


  return (
    
    <div className="flex flex-col items-center justify-center bg-gray-200 shadow w-full">
      <h2 className="text-xl text-black font-bold mb-4">{lastMonthName} - Stromgenerierung</h2>
      <div className="flex w-full justify-between">
        {solarYieldData.map((day, index) => {
          const { weekday, day: dayOfMonth } = formatDate(day.timestamp);
          return (
            <div key={index} className="relative flex flex-grow flex-col items-start rounded-[10px] border-[1px] border-gray-200 bg-white bg-clip-border shadow-md shadow-[#F3F3F3] dark:border-[#ffffff33] dark:bg-navy-800 dark:text-white dark:shadow-none m-1" style={{ height: 'auto' }}>
            <div className="flex w-auto flex-row items-center" style={{ height: '45px' }}>  {/* Reduzierte Höhe */}
              <div className="ml-[-10px] rounded-full bg-lightPrimary p-3 dark:bg-navy-700">
                <span className="bg-yellow-500 p-2 ml-3 absolute top-0 -mt-4 -mr-4 rounded text-white fill-current shadow flex flex-col items-center justify-center" style={{ width: '60px', height: '60px' }}>
                  <NumberIcons number={dayOfMonth} />
                  <div className="text-xs mt-1">{weekday}</div> 
                </span>
              </div>
            </div>
            <div className="flex flex-grow w-full" style={{ height: 'auto' }}>
              <div className="flex flex-col flex-grow justify-end items-end p-4">
                <h4 className="text-2xl text-navy-700 dark:text-black">{day.total_solar_yield.toFixed(2)} kWh</h4>
              </div>
            </div>
          </div>
          

          );
        })}
      </div>
    </div>
  );
};

export default SolarYieldDisplay;


