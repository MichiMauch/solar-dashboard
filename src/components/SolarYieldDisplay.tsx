import React, { useEffect, useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

interface SolarYieldData {
  timestamp: number;
  total_solar_yield: number;
  total_consumption: number;
}

const fetchSolarYieldData = async (): Promise<SolarYieldData[]> => {
  const res = await fetch('/api/solarHistory');
  if (!res.ok) {
    throw new Error('Failed to fetch solar yield data');
  }
  const data = await res.json();
  return data;
};

const formatDate = (timestamp: number): { weekday: string, day: string, month: string } => {
  const date = new Date(timestamp);
  const weekday = date.toLocaleDateString("de-DE", { weekday: 'short' });
  const day = date.toLocaleDateString("de-DE", { day: 'numeric' });
  const month = date.toLocaleDateString("de-DE", { month: 'long' });

  return { weekday, day, month };
};

const formatShortDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const day = date.toLocaleDateString("de-DE", { day: '2-digit' });
  const month = date.toLocaleDateString("de-DE", { month: '2-digit' });

  return `${day}.${month}.`;
};

const SolarYieldDisplay: React.FC = () => {
  const [solarYieldData, setSolarYieldData] = useState<SolarYieldData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSolarYieldData().then(data => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const filteredData = data.filter(day => day.timestamp < today.getTime());
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
      <div className="flex items-center justify-end p-2 font-sans text-base font-normal text-blue-gray-700 border-b border-gray-300">
        <div className="flex-1 text-center">Datum</div>
        <div className="flex-1 text-right">Produktion</div>
        <div className="flex-1 text-right">Verbrauch</div>
      </div>
      <nav className="flex flex-col gap-1 p-2 font-sans text-base font-normal text-blue-gray-700 overflow-auto">
        {solarYieldData.map((day) => {
          const { weekday, day: dayOfMonth, month } = formatDate(day.timestamp);
          const shortDate = formatShortDate(day.timestamp);
          return (
            <div 
              key={day.timestamp} 
              role="button" 
              className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
            >
              <div className="flex-1 mt-1 text-center lg:hidden">{weekday}, {dayOfMonth}. {month}</div>
              <div className="flex-1 mt-1 text-center lg:block hidden">{shortDate}</div>
              <div className="flex-1 text-center">
                <div className="relative grid items-center px-2 py-1 font-sans font-bold text-gray-900 select-none whitespace-nowrap text-right lg:font-bold lg:bg-transparent">
                  <span>{day.total_solar_yield.toFixed(2)} kWh</span>
                </div>
              </div>
              <div className="flex-1 text-center">
                <div className="relative grid items-center px-2 py-1 font-sans font-bold text-gray-900 select-none whitespace-nowrap text-right lg:font-bold lg:bg-transparent">
                  <span>{day.total_consumption.toFixed(2)} kWh</span>
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
