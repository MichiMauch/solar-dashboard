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
import PeakPowerDisplay from '../components/PeakPowerDisplay';
import PeakPowerChart from '../components/PeakPowerChart';

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
    <><div className="h-screen flex flex-col">
    <div className="bg-black p-2 shadow-md flex-grow">
      <DashboardHeader currentTime={currentTime} />
    </div>
    <div className="bg-neutral-200 shadow-md flex-grow">
      <div className="container items-center px-4 py-4 m-auto mt-2.5">
        <div className="flex flex-wrap pb-3 mx-4 md:mx-24 lg:mx-0">
          <div className="w-full p-2 lg:w-1/4 md:w-1/2">
            <PowerDisplay powerData={data.records.Pdc} onTimeUpdate={setCurrentTime} />
          </div>
          <div className="w-full p-2 lg:w-1/4 md:w-1/2">
            <TodayProductionDisplay records={data.records.total_solar_yield} />
          </div>
          <div className="w-full p-2 lg:w-1/4 md:w-1/2">
            <TodayConsumptionDisplay records={data.records.total_consumption} />
          </div>
          <div className="w-full p-2 lg:w-1/4 md:w-1/2">
            <PeakPowerDisplay />
          </div>
        </div>
      </div>
    </div>
    <div className="bg-neutral-100 p-4 shadow-md flex-grow">
  <div className="flex gap-2 mx-auto max-w-screen-xl">
    <div className="flex-1 p-2 h-96 flex flex-col">
      <SolarMonthlyDisplay />
    </div>
    <div className="flex-1 p-2 h-96 flex flex-col">
      <SolarYieldDisplay />
    </div>
    <div className="flex-1 p-2 h-96 flex flex-col">
      <BatteryDisplay batteryStatus={data.records.bs} />
    </div>
  </div>
</div>

      <div className="bg-white p-4 shadow-md rounded-lg flex-grow">
      <div className="w-full p-2">
          <div className="flex justify-center">
            <div className="w-full max-w-4xl"> {/* Gibt dem Diagramm eine Maximalbreite */}
              <div className="relative flex flex-col text-gray-700 bg-white shadow-md rounded-xl bg-clip-border p-2">
                <SolarMonthlyChart />
              </div>
            </div>
          </div>
        </div>      </div>
      <div className="bg-white p-4 shadow-md rounded-lg flex-grow">
      <div className="w-full p-2">
          <div className="flex justify-center">
            <div className="w-full max-w-4xl"> {/* Gibt dem Diagramm eine Maximalbreite */}
              <div className="relative flex flex-col text-gray-700 bg-white shadow-md rounded-xl bg-clip-border p-2">
                <PeakPowerChart />
              </div>
            </div>
          </div>
        </div>      
      </div>
    </div><div className="h-screen flex flex-col"> 
      </div></>


  );
}

export default Page;
