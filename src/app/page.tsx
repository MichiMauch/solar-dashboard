// src/pages/Page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import useIntervalFetch from '../hooks/useIntervalFetch';
import PowerDisplay from '../components/PowerDisplay';
import BatteryDisplay from '../components/BatteryDisplay';
import TodayProductionDisplay from '../components/TodayProductionDisplay';
import CurrentConsumptionDisplay from '../components/CurrentConsumptionDisplay';
import TodayConsumptionDisplay from '../components/TodayConsumptionDisplay';
import DashboardHeader from '../components/DashboardHeader';
import SolarYieldDisplay from '../components/SolarYieldDisplay';
import SolarMonthlyDisplay from '../components/SolarMonthlyDisplay';
import SolarMonthlyChart from '../components/SolarMonthlyChart';




function Page() {
  const { data, error } = useIntervalFetch();
  const [currentTime, setCurrentTime] = useState(''); // Zustand für die Zeit
  const [monthlyData, setMonthlyData] = useState({ records: { Pdc: [] } });
  const [monthlyTime, setMonthlyTime] = useState('');

  // Hole monatliche Daten
  useEffect(() => {
    const fetchMonthlyData = async () => {
      const response = await fetch('/api/solar?start=1704067200&interval=months&type=live_feed');
      const data = await response.json();
      setMonthlyData(data);
    };

    fetchMonthlyData();
  }, []);

  if (error) {
    return <div>Fehler beim Laden der Daten: {error}. Bitte versuchen Sie es später erneut oder kontaktieren Sie den Support.</div>;
  }
  if (!data) return <div>Lade Daten...</div>;

  return (
<div className="h-screen flex flex-col">
  {/* Erste Zeile: Nur DashboardHeader */}
  <div className="text-center p-4">
    <DashboardHeader currentTime={currentTime} />
  </div>

  {/* Zweite Zeile: Drei Komponenten in drei Spalten */}
  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2 p-2 mx-auto max-w-screen-xl">
    <div className="w-full p-2">
      <PowerDisplay powerData={data.records.Pdc} onTimeUpdate={setCurrentTime} />
    </div>
    <div className="w-full p-2">
      <TodayProductionDisplay records={data.records.total_solar_yield} />
    </div>
    <div className="w-full lg:col-span-2 xl:col-span-1 p-2">
      <TodayConsumptionDisplay records={data.records.total_consumption} />
    </div>
  </div>

{/* Dritte Zeile: Drei Komponenten in drei Spalten */}
<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2 p-2 mx-auto max-w-screen-xl">
  <div className="w-full p-2 h-96"> {/* feste Höhe */}
    <SolarMonthlyDisplay />
  </div>
  <div className="w-full p-2 h-96"> {/* feste Höhe */}
    <SolarYieldDisplay />     
  </div>
  <div className="w-full lg:col-span-2 xl:col-span-1 p-2 h-96"> {/* feste Höhe */}
    <BatteryDisplay batteryStatus={data.records.bs} />
  </div>
</div>



{/* Vierte Zeile: SolarMonthlyChart in einer vollen Breite */}
<div className="w-full p-2">
  <div className="flex justify-center">
    <div className="w-full max-w-4xl"> {/* Gibt dem Diagramm eine Maximalbreite */}
      <div className="relative flex flex-col text-gray-700 bg-white shadow-md rounded-xl bg-clip-border p-2">
        <SolarMonthlyChart />
      </div>
    </div>
  </div>
</div>



</div>


  );
}

export default Page;
