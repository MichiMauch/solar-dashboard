import React, { useEffect, useState } from 'react';

interface SolarMonthData {
  timestamp: number;
  total_solar_yield: number;
  total_consumption: number;
}

const fetchSolarMonthData = async (): Promise<SolarMonthData[]> => {
  const res = await fetch('/api/solarMonthlyHistory');
  if (!res.ok) {
    throw new Error('Failed to fetch solar month data');
  }
  const data = await res.json();
  return data;
};

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("de-DE", {
    year: 'numeric',
    month: 'long'
  });
};

const formatShortDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  const month = date.toLocaleDateString("de-DE", { month: '2-digit' });
  const year = date.toLocaleDateString("de-DE", { year: '2-digit' });
  return `${month}.${year}`;
};

const SolarMonthlyDisplay: React.FC = () => {
  const [solarMonthData, setSolarMonthData] = useState<SolarMonthData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSolarMonthData().then(data => {
      setSolarMonthData(data);
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
      <nav className="flex min-w-[240px] flex-col gap-1 p-2 font-sans text-base font-normal text-blue-gray-700 overflow-auto">
        {solarMonthData.map((month) => {
          const fullDate = formatDate(month.timestamp);
          const shortDate = formatShortDate(month.timestamp);
          return (
            <div 
              key={month.timestamp} 
              role="button" 
              className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
            >
              <div className="flex-1 mt-1 text-center lg:hidden">{fullDate}</div>
              <div className="flex-1 mt-1 text-center lg:block hidden">{shortDate}</div>
              <div className="flex-1 text-center">
                <div className="relative grid items-center px-2 py-1 font-sans font-bold text-gray-900 select-none whitespace-nowrap text-right lg:font-bold lg:bg-transparent">
                  <span>{month.total_solar_yield.toFixed(2)} kWh</span>
                </div>
              </div>
              <div className="flex-1 text-center">
                <div className="relative grid items-center px-2 py-1 font-sans font-bold text-gray-900 select-none whitespace-nowrap text-right lg:font-bold lg:bg-transparent">
                  <span>{month.total_consumption.toFixed(2)} kWh</span>
                </div>
              </div>
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default SolarMonthlyDisplay;
