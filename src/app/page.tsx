'use client'; // Dies ganz oben in Ihrer Datei hinzufügen
import React, { useEffect, useState } from 'react';
import { fetchData } from './api/solar-status';

interface PowerEntry {
  time: string;
  power: number;
}

function Page() {
  const [currentPower, setCurrentPower] = useState<PowerEntry>({ time: '', power: 0 });
  const [batteryCharge, setBatteryCharge] = useState<number | null>(null);
  const [error, setError] = useState<string>('');

  const updateData = () => {
    fetchData()
      .then(response => {
        const lastPowerEntry = response.records.Pdc[response.records.Pdc.length - 1];
        const lastBatteryEntry = response.records.bs[response.records.bs.length - 1];
        setCurrentPower({
          time: new Date(lastPowerEntry[0]).toLocaleTimeString(),
          power: lastPowerEntry[1]
        });
        setBatteryCharge(lastBatteryEntry[1]);
      })
      .catch(err => {
        setError('Fehler beim Laden der Daten.');
        console.error("Fehler beim Laden der Daten:", err);
      });
  };

  useEffect(() => {
    updateData();
    const intervalId = setInterval(updateData, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h1>Solaranlagen Dashboard</h1>
      <p>Aktuelle Leistung: {currentPower.time} - {currentPower.power.toFixed(2)} Watt</p>
      {batteryCharge !== null ? (
        <p>Aktuelle Batterieladung: {batteryCharge.toFixed(2)}%</p>
      ) : (
        <p>Batterieladung wird geladen...</p>
      )}
      {error && <p>{error}</p>}
    </div>
  );
}

export default Page;
