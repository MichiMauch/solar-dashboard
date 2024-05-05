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
    <div className="h-screen">
      <div className="text-center p-4"> {/* Zentrierter Textbereich für den Titel */}
        <h1 className="text-3xl font-bold text-gray-700">Solaranlagen Dashboard - {currentTime}</h1>
      </div>
      <div className="flex flex-wrap -mx-2">
        <div className="w-full sm:w-1/2 p-2">
          <div className="bg-red-500 p-4 h-full"> {/* PowerDisplay in einer roten Box */}
            <PowerDisplay powerData={data.records.Pdc} onTimeUpdate={setCurrentTime} />
          </div>
        </div>
        <div className="w-full sm:w-1/2 p-2">
          <div className="bg-green-500 p-4 h-full"> {/* BatteryDisplay in einer grünen Box */}
            <BatteryDisplay batteryStatus={data.records.bs} />
          </div>
        </div>
        <div className="w-full sm:w-1/2 p-2">
          <div className="bg-yellow-500 p-4 h-full"> {/* TodayProductionDisplay in einer gelben Box */}
            <TodayProductionDisplay records={data.records.total_solar_yield} />
          </div>
        </div>
        <div className="w-full sm:w-1/2 p-2">
          <div className="bg-purple-500 p-4 h-full"> {/* Combined Consumption Displays in einer lila Box */}
            <TodayConsumptionDisplay records={data.records.total_consumption} />
          </div>
        </div>
        <div className="w-full sm:w-1/2 p-2">
          <div className="bg-purple-500 p-4 h-full"> {/* Combined Consumption Displays in einer lila Box */}
            <CurrentConsumptionDisplay consumption={data.records.total_consumption[0][1] * 1000} />
          </div>
        </div>
      </div>
    </div>
  );
  
  
}

export default Page;
