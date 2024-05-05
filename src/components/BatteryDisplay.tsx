// src/components/BatteryDisplay.tsx
import React from 'react';

interface BatteryDisplayProps {
  batteryStatus: Array<[number, number, number, number]>; // Die Daten der Batteriestatus
}

const BatteryDisplay: React.FC<BatteryDisplayProps> = ({ batteryStatus }) => {
  // Letzten Eintrag des Batterieladezustands ermitteln
  const lastBatteryEntry = batteryStatus[batteryStatus.length - 1];

  const charge = lastBatteryEntry ? lastBatteryEntry[1] : null; // Nehmen Sie an, dass der Ladezustand im zweiten Feld gespeichert ist

  return charge !== null ? (
    <p>Aktuelle Batterieladung: {charge.toFixed(2)}%</p>
  ) : (
    <p>Batterieladung wird geladen...</p>
  );
};

export default BatteryDisplay;
