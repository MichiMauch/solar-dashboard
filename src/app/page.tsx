'use client';
import React, { useState, useEffect } from 'react';
import useIntervalFetch from '../hooks/useIntervalFetch';
import PowerDisplay from '../components/PowerDisplay';
import BatteryDisplay from '../components/BatteryDisplay';
import TodayProductionDisplay from '../components/TodayProductionDisplay';
import TodayConsumptionDisplay from '../components/TodayConsumptionDisplay';
import DashboardHeader from '../components/DashboardHeader';
import SolarYieldDisplay from '../components/SolarYieldDisplay';
import SolarMonthlyDisplay from '../components/SolarMonthlyDisplay';
import SolarMonthlyChart from '../components/SolarMonthlyChart';
import PeakPowerDisplay from '../components/PeakPowerDisplay';
import PeakPowerChart from '../components/PeakPowerChart';
import ExternalPowerChart from '../components/ExternalPowerChart';
import AutarkieChart from '../components/AutarkieChart';
import AutarkieChart1 from '../components/AutarkieChart1';

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
    <>
      <div className="h-screen flex flex-col">
        <div className="bg-black p-2 shadow-md flex-grow">
          <DashboardHeader currentTime={currentTime} />
        </div>
        <div className="bg-gradient-to-br from-purple-400 via-blue-400 to-blue-500 shadow-md flex-grow">
          <div className="container items-center px-4 py-4 m-auto mt-2.5 w-full lg:w-3/4">
            <div className="flex flex-wrap mx-4 md:mx-0 lg:mx-0">
              <div className="flex flex-wrap w-full lg:w-2/3">
                <div className="w-full p-2 lg:w-1/2 md:w-1/2">
                  <PowerDisplay powerData={data.records.Pdc} onTimeUpdate={setCurrentTime} />
                </div>
                <div className="w-full p-2 lg:w-1/2 md:w-1/2">
                  <TodayProductionDisplay records={data.records.total_solar_yield} />
                </div>
                <div className="w-full p-2 lg:w-1/2 md:w-1/2">
                  <TodayConsumptionDisplay records={data.records.total_consumption} />
                </div>
                <div className="w-full p-2 lg:w-1/2 md:w-1/2">
                  <PeakPowerDisplay />
                </div>
              </div>
              <div className="w-full p-2 lg:w-1/3 md:w-1/2">
                <BatteryDisplay batteryStatus={data.records.bs} />
              </div>
            </div>
            <div className="flex flex-wrap mx-4 md:mx-0 lg:mx-0">
              <div className="flex flex-wrap w-full">
                <div className="w-full lg:w-1/3 p-2">
                  <SolarYieldDisplay />
                </div>
                <div className="w-full lg:w-1/3 p-2">
                  <AutarkieChart />
                </div>
                <div className="w-full lg:w-1/3 p-2">
                  <AutarkieChart1 />
                </div>
                <div className="w-full lg:w-2/3 p-2 flex flex-col">
                  <div className="bg-white shadow-md rounded-xl bg-clip-border p-4 flex-grow h-full">
                    <SolarMonthlyChart />
                  </div>
                </div>
                <div className="w-full lg:w-1/3 p-2">
                  <SolarMonthlyDisplay />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap mx-4 md:mx-0 lg:mx-0">
              <div className="flex flex-wrap w-full">
                <div className="w-full lg:w-1/2 p-2">
                  <div className="bg-white shadow-md rounded-xl bg-clip-border p-4 h-full flex items-center justify-center">
                    <div className="w-full h-full">
                      <PeakPowerChart />
                    </div>
                  </div>
                </div>
                <div className="w-full lg:w-1/2 p-2">
                  <div className="bg-white shadow-md rounded-xl bg-clip-border p-4 h-full flex items-center justify-center">
                    <div className="w-full h-full">
                      <ExternalPowerChart />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default Page;
