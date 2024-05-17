import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

interface ExternalPowerData {
  timestamp: number;
  grid_history_from: number;
}

const ExternalPowerChart: React.FC = () => {
  const [externalPowerData, setExternalPowerData] = useState<ExternalPowerData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data from /api/gridHistoryFrom...');
        const res = await fetch('/api/gridHistoryFrom'); // Überprüfe hier die Endpunkt-URL
        if (!res.ok) {
          console.error('Response status:', res.status);
          throw new Error('Failed to fetch data');
        }
        const data = await res.json();
        console.log('Fetched External Power Data:', data);
        setExternalPowerData(data);
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

  // Daten umkehren
  const reversedData = [...externalPowerData].reverse();

  const chartData = {
    labels: reversedData.map(({ timestamp }) =>
      new Date(timestamp * 1000).toLocaleDateString('de-DE', { year: 'numeric', month: 'long' })
    ),
    datasets: [
      {
        label: 'Strombezug von extern (kWh)',
        data: reversedData.map(({ grid_history_from }) => grid_history_from),
        fill: false,
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
      },
    ],
  };
  

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Strombezug von extern der letzten 24 Monate', // Customize the title here
        font: {
          size: 18, // Adjust the size of the title
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Monat',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Strombezug (kWh)',
        },
      },
    },
  };

  return (
    <div style={{ width: '100%' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default ExternalPowerChart;
