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
  <div className="flex flex-row justify-between p-2">
    <div className="w-1/3 p-2"> {/* PowerDisplay in einer roten Box */}
      <PowerDisplay powerData={data.records.Pdc} onTimeUpdate={setCurrentTime} />
    </div>
    <div className="w-1/3 p-2"> {/* TodayProductionDisplay in einer gelben Box */}
      <TodayProductionDisplay records={data.records.total_solar_yield} />
    </div>
    <div className="w-1/3 p-2"> {/* TodayConsumptionDisplay in einer lila Box */}
      <TodayConsumptionDisplay records={data.records.total_consumption} />
    </div>
  </div>

  {/* Dritte Zeile: Weitere drei Komponenten in drei Spalten */}
  <div className="flex flex-col">
  {/* Erste Zeile nur für SolarYieldDisplay in einer eigenen Spalte */}
  <div className="w-3/3 p-2"> 
    <SolarYieldDisplay />
</div>



  {/* Zweite Zeile für SolarMonthlyDisplay und BatteryDisplay in zwei Spalten */}
  <div className="flex flex-row justify-between p-2">
    <div className="w-1/2 p-2"> {/* SolarMonthlyDisplay in einer grünen Box */}
      <div className="bg-green-500 p-4 rounded shadow">
        <SolarMonthlyDisplay />
      </div>
    </div>
    <div className="w-1/2 p-2"> {/* BatteryDisplay in einer blauen Box */}
      <div className="bg-blue-500 p-4 rounded shadow">
        <BatteryDisplay batteryStatus={data.records.bs} />
      </div>
    </div>
  </div>
</div>


  {/* Vierte Zeile: SolarMonthlyChart in einer vollen Breite */}
  <div className="w-full p-2">
    <div className="flex justify-center">
      <div className="w-full max-w-4xl"> {/* Gibt dem Diagramm eine Maximalbreite */}
        <SolarMonthlyChart />
      </div>
    </div>
  </div>
</div>

  );
}

export default Page;
