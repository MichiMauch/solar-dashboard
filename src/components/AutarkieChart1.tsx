import React, { useEffect, useState } from 'react';

interface AutarkieData {
  total_solar_yield: number;
  total_consumption: number;
  grid_history_from: number;
  autarkie: string;
}

const AutarkieChart1: React.FC = () => {
  const [autarkieData, setAutarkieData] = useState<AutarkieData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data from /api/autarkie...');
        const res = await fetch('/api/autarkie');
        if (!res.ok) {
          console.error('Response status:', res.status);
          throw new Error('Failed to fetch data');
        }
        const data = await res.json();
        console.log('Fetched Autarkie Data:', data);
        setAutarkieData(data);
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
  if (!autarkieData) return <div>No data available</div>;

  return (
    <>
      <div className="flex flex-wrap gap-4 w-full">
        <div className="w-full flex flex-col px-4 py-4 overflow-hidden bg-white hover:bg-gradient-to-br hover:from-purple-400 hover:via-blue-400 hover:to-blue-500 rounded-xl shadow-lg duration-300 hover:shadow-2xl group">
          <div className="flex flex-row justify-between items-center">
            <div className="px-4 py-4 bg-gray-300 rounded-xl bg-opacity-30">
              <i className="fa-solid fa-bolt text-yellow-500 text-3xl"></i>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl xl:text-5xl font-bold text-gray-700 mt-6 group-hover:text-gray-50">
            {Math.round(autarkieData.total_consumption)} kWh
          </h1>
          <div className="flex flex-row justify-between text-gray-700 group-hover:text-gray-200">
            <p>Gesamtverbrauch 2024</p>
          </div>
        </div>
        <div className="w-full flex flex-col px-4 py-4 overflow-hidden bg-white hover:bg-gradient-to-br hover:from-purple-400 hover:via-blue-400 hover:to-blue-500 rounded-xl shadow-lg duration-300 hover:shadow-2xl group">
          <div className="flex flex-row justify-between items-center">
            <div className="px-4 py-4 bg-gray-300 rounded-xl bg-opacity-30">
              <i className="fa-solid fa-plug-circle-minus fa-rotate-180 text-violet-500 text-3xl"></i>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl xl:text-5xl font-bold text-gray-700 mt-6 group-hover:text-gray-50">
            {Math.round(autarkieData.grid_history_from)} kWh
          </h1>
          <div className="flex flex-row justify-between text-gray-700 group-hover:text-gray-200">
            <p>Strombezug von extern 2024</p>
          </div>
        </div>
      </div>  
    </>
  );
};

export default AutarkieChart1;
