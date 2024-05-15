import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

interface PeakPowerData {
  timestamp: number;
  peak_power: number;
}

const PeakPowerChart: React.FC = () => {
  const [peakPowerData, setPeakPowerData] = useState<PeakPowerData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/solarPeakHistory'); // Adjust your endpoint as needed
        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await res.json();
        console.log('Fetched Peak Power Data:', data);
        setPeakPowerData(data);
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

  const chartData = {
    labels: peakPowerData.map(({ timestamp }) => new Date(timestamp).toLocaleDateString("de-DE")),
    datasets: [
      {
        label: 'Peak Power (W)',
        data: peakPowerData.map(({ peak_power }) => (peak_power).toFixed(2)), // Ensure this converts to kW correctly
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Spitzenleistungen der letzten 30 Tage', // Customize the title here
        font: {
          size: 18, // Adjust the size of the title
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Datum',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Spitzenleistung (W)',
        },
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default PeakPowerChart;
