// src/pages/Page.tsx
'use client';
import React, { useState } from 'react';
import useIntervalFetch from '../hooks/useIntervalFetch';
import PowerDisplay from '../components/PowerDisplay';
import BatteryDisplay from '../components/BatteryDisplay';
import TodayProductionDisplay from '../components/TodayProductionDisplay';
import CurrentConsumptionDisplay from '../components/CurrentConsumptionDisplay';
import TodayConsumptionDisplay from '../components/TodayConsumptionDisplay'; 

function Page() {
  const { data, error } = useIntervalFetch();
  const [currentTime, setCurrentTime] = useState('');  // Zustand für die Zeit

  if (error) {
    return <div>Fehler beim Laden der Daten: {error}. Bitte versuchen Sie es später erneut oder kontaktieren Sie den Support.</div>;
  }
  if (!data) return <div>Lade Daten...</div>;

  return (
    <div>
      <h1>Solaranlagen Dashboard - {currentTime}</h1>
      <PowerDisplay powerData={data.records.Pdc} onTimeUpdate={setCurrentTime} />
      <BatteryDisplay batteryStatus={data.records.bs} />
      <TodayProductionDisplay records={data.records.total_solar_yield} />
      <TodayConsumptionDisplay records={data.records.total_consumption} />
      <CurrentConsumptionDisplay consumption={data.records.total_consumption[0][1] * 1000} />
    </div>
  );
}

export default Page;
