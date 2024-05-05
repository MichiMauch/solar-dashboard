// src/components/TodayProductionDisplay.tsx
import React from 'react';

interface TodayProductionDisplayProps {
  records: Array<[number, number]>;  // Die Daten der gesamten Solarerträge
}

const TodayProductionDisplay: React.FC<TodayProductionDisplayProps> = ({ records }) => {
  // Berechnung der heute produzierten Energie
  const today = new Date().setHours(0, 0, 0, 0);
  const todayProductionSum = records
    .filter(([timestamp]) => new Date(timestamp).setHours(0, 0, 0, 0) === today)
    .reduce((acc, [, production]) => acc + production, 0);

  return (
    <p>Heute erzeugter Strom: {todayProductionSum.toFixed(2)} kWh</p>
  );
};

export default TodayProductionDisplay;
