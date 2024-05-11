import React, { useEffect, useState } from 'react';

interface SolarMonthData {
  timestamp: number;
  total_solar_yield: number;
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
  const date = new Date(timestamp * 1000); // Konvertiert Unix-Sekunden in Millisekunden
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
    <div className="flex flex-col items-center justify-center">
      {solarMonthData.map((month, index) => (
        <div key={index} className="bg-green-200 p-4 m-2 rounded-lg shadow-lg w-full">
          <h3 className="font-bold text-lg">{formatDate(month.timestamp)}</h3>
          <p>Gesamtertrag: {month.total_solar_yield.toFixed(2)} kWh</p>
        </div>
      ))}
    </div>
  );
};

export default SolarMonthlyDisplay;
