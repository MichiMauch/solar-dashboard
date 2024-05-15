import React, { useEffect, useState } from 'react';

interface PeakPowerData {
  timestamp: number;
  peak_power: number;
}

const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("de-DE", {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });
};

const PeakPowerDisplay: React.FC = () => {
  const [peakPowerData, setPeakPowerData] = useState<PeakPowerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/solarPeak'); // Ensure the correct endpoint is used
        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await res.json();
        console.log('Fetched Peak Power Data:', data);
        setPeakPowerData(data); // Set only the current day's peak power data
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (!peakPowerData) return <div>No data available</div>;

  return (
    <div
      className="flex flex-col px-4 py-4 overflow-hidden bg-white hover:bg-gradient-to-br hover:from-purple-400 hover:via-blue-400 hover:to-blue-500 rounded-xl shadow-lg duration-300 hover:shadow-2xl group">
      <div className="flex flex-row justify-between items-center">
        <div className="px-4 py-4 bg-gray-300  rounded-xl bg-opacity-30">
          <i className="fa-solid fa-bolt text-cyan-500 text-3xl"></i>
        </div>
        
      </div>
      <h1 className="text-3xl sm:text-4xl xl:text-5xl font-bold text-gray-700 mt-6 group-hover:text-gray-50">
        {(peakPowerData.peak_power / 1000).toFixed(2)} kW
      </h1>
      <div className="flex flex-row justify-between text-gray-700 group-hover:text-gray-200">
        <p>Spitzenleistung um {formatTime(peakPowerData.timestamp)}</p>
      </div>
    </div>
  );
};

export default PeakPowerDisplay;
