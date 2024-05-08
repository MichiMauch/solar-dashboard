// src/pages/Page.tsx
'use client';
import React, { useState } from 'react';
import useIntervalFetch from '../hooks/useIntervalFetch';
import PowerDisplay from '../components/PowerDisplay';
import BatteryDisplay from '../components/BatteryDisplay';
import TodayProductionDisplay from '../components/TodayProductionDisplay';
import CurrentConsumptionDisplay from '../components/CurrentConsumptionDisplay';
import TodayConsumptionDisplay from '../components/TodayConsumptionDisplay'; 
import DashboardHeader from '../components/DashboardHeader'; 


function Page() {
  const { data, error } = useIntervalFetch();
  const [currentTime, setCurrentTime] = useState('');  // Zustand für die Zeit

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

      {/* Zweite Zeile: Zwei Spalten mit den anderen Komponenten */}
      <div className="flex flex-col lg:flex-row flex-grow">
        {/* Hauptinhalt: PowerDisplay und weitere Displays */}
        <div className="w-full lg:w-2/3 p-2 flex flex-wrap">
          <div className="w-full lg:w-1/2 p-2"> {/* PowerDisplay in einer roten Box */}
            <PowerDisplay powerData={data.records.Pdc} onTimeUpdate={setCurrentTime} />
          </div>
          <div className="w-full lg:w-1/2 p-2"> {/* TodayProductionDisplay in einer gelben Box */}
            <TodayProductionDisplay records={data.records.total_solar_yield} />
          </div>
          <div className="w-full lg:w-1/2 p-2"> {/* TodayConsumptionDisplay in einer lila Box */}
            <TodayConsumptionDisplay records={data.records.total_consumption} />
          </div>
          <div className="w-full lg:w-1/2 p-2"> {/* Platz für ein viertes Element */}
            {/* Platzhalter oder weiteres Display hier einfügen */}
          </div>
        </div>
        
        {/* Rechte Spalte (auf kleinen Bildschirmen am Ende): Nur BatteryDisplay */}
        <div className="w-full lg:w-1/3 p-2 flex flex-col">
          <div className="p-4 h-full"> {/* BatteryDisplay in einer grünen Box */}
            <BatteryDisplay batteryStatus={data.records.bs} />
          </div>
        </div>
      </div>
    </div>



  );
  
  
}

export default Page;
