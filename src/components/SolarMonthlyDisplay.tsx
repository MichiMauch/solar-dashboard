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
    <div className="relative flex flex-col text-gray-700 bg-white shadow-md w-96 rounded-xl bg-clip-border">
      <div className="flex items-center justify-between p-2 font-sans text-base font-normal text-blue-gray-700 border-b border-gray-300">
        <div className="flex-grow"></div>
        <div className="flex space-x-2">
          <div className="flex-grow text-center">Produktion</div>
          <div className="flex-grow text-center">Verbrauch</div>
        </div>
      </div>
      <nav className="flex min-w-[240px] flex-col gap-1 p-2 font-sans text-base font-normal text-blue-gray-700">
        {solarMonthData.map((month) => (
          <div key={month.timestamp} role="button" className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900">
            <div className="flex-grow text-m mt-1">{formatDate(month.timestamp)}</div>
            <div className="flex space-x-2">
              <div className="relative grid items-center px-2 py-1 font-sans text-xs font-bold text-gray-900 rounded-full select-none whitespace-nowrap bg-yellow-600/50">
                <span>{month.total_solar_yield.toFixed(2)} kWh</span>
              </div>
              <div className="relative grid items-center px-2 py-1 font-sans text-xs font-bold text-gray-900 rounded-full select-none whitespace-nowrap bg-blue-600/30">
                <span>{month.total_consumption.toFixed(2)} kWh</span>
              </div>
            </div>
          </div> 
        ))}
      </nav>
    </div>
  );
};

export default SolarMonthlyDisplay;
