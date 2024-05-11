import { ChartData } from 'chart.js';
import { Line } from 'react-chartjs-2';
import React, { useEffect, useState } from 'react';
import 'chart.js/auto';

interface SolarMonthData {
  timestamp: number;
  total_solar_yield: number;
}

const fetchSolarMonthData = async (): Promise<SolarMonthData[]> => {
  const res = await fetch('/api/solarMonthlyHistoryChart');
  if (!res.ok) {
    throw new Error('Failed to fetch solar month data');
  }
  const data = await res.json();
  return data;
};

const SolarMonthlyChart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData<'line'>>({ datasets: [] });

  const prepareChartData = async () => {
    const data = await fetchSolarMonthData();
    const currentYearData = data.slice(12, 24); // Die letzten 12 Monate
    const previousYearData = data.slice(0, 12); // Die 12 Monate davor

    setChartData({
      labels: currentYearData.map(d => new Date(d.timestamp * 1000).toLocaleDateString("de-DE", { month: 'long' })),
      datasets: [
        {
          label: 'Vergangene 12 Monate (kWh)', // Anpassung der Bezeichnung
          data: previousYearData.map(d => d.total_solar_yield),
          borderColor: 'rgb(255, 99, 132)',
          fill: false,
          tension: 0.1
        },
        {
          label: 'Aktuelle 12 Monate (kWh)', // Anpassung der Bezeichnung
          data: currentYearData.map(d => d.total_solar_yield),
          borderColor: 'rgb(75, 192, 192)',
          fill: false,
          tension: 0.1
        }
      ]
    });
  };

  useEffect(() => {
    prepareChartData();
  }, []);

  return (
    <div>
      <h2>Monatlicher Solarertrag Vergleich</h2>
      <Line data={chartData} />
    </div>
  );
};

export default SolarMonthlyChart;
