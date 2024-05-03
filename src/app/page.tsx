'use client'; // Dies ganz oben in Ihrer Datei hinzufügen, falls Next.js 13 und SSR verwendet wird
import React, { useEffect, useState } from 'react';

interface PowerEntry {
  time: string;
  power: number;
}

interface ResponseData {
  records: {
    Pdc: Array<[number, number]>;
    bs: Array<[number, number, number, number]>;
  };
}

function Page() {
  const [currentPower, setCurrentPower] = useState<PowerEntry>({ time: '', power: 0 });
  const [batteryCharge, setBatteryCharge] = useState<number | null>(null);
  const [error, setError] = useState<string>('');

  // Funktion zum Abrufen der Daten
  const fetchSolarData = async () => {
    try {
      const res = await fetch('../../api/solar');
      const data: ResponseData = await res.json();
      const lastPowerEntry = data.records.Pdc[data.records.Pdc.length - 1];
      const lastBatteryEntry = data.records.bs[data.records.bs.length - 1];
      setCurrentPower({
        time: new Date(lastPowerEntry[0]).toLocaleTimeString(),
        power: lastPowerEntry[1]
      });
      setBatteryCharge(lastBatteryEntry[1]);
    } catch (err) {
      setError('Fehler beim Laden der Daten.');
      console.error("Fehler beim Laden der Daten:", err);
    }
  };

  useEffect(() => {
    fetchSolarData();
    const intervalId = setInterval(fetchSolarData, 5000);

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
