import React from 'react';

interface PowerDisplayProps {
  powerData: Array<[number, number]>;
  onTimeUpdate: (time: string) => void;  // Callback-Funktion hinzufügen
}

const PowerDisplay: React.FC<PowerDisplayProps> = ({ powerData, onTimeUpdate }) => {
  // Letzten Eintrag der Leistung ermitteln
  const lastPowerEntry = powerData[powerData.length - 1];
  const time = lastPowerEntry ? new Date(lastPowerEntry[0]).toLocaleTimeString() : '';
  const power = lastPowerEntry ? lastPowerEntry[1] : 0;

  // Aktualisiere die Zeit über den Callback
  React.useEffect(() => {
    onTimeUpdate(time);
  }, [time, onTimeUpdate]);

  return (
    <p>Aktuelle Leistung: {power.toFixed(2)} Watt</p>
  );
};

export default PowerDisplay;
