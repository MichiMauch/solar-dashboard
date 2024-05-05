// src/components/TodayConsumptionDisplay.tsx
import React from 'react';

interface TodayConsumptionDisplayProps {
  records: Array<[number, number]>;
}

const TodayConsumptionDisplay: React.FC<TodayConsumptionDisplayProps> = ({ records }) => {
  const today = new Date().setHours(0, 0, 0, 0); // Setzt die heutige Zeit auf Mitternacht

  const totalConsumption = records.reduce((sum, record) => {
    const recordDate = new Date(record[0]).setHours(0, 0, 0, 0);
    // Fügt nur die Werte zum Summen hinzu, die am aktuellen Tag aufgezeichnet wurden
    if (recordDate === today) {
      return sum + record[1];
    }
    return sum;
  }, 0);

  return (
    <p>Heutiger Gesamtverbrauch: {(totalConsumption).toFixed(2)} kWh</p> // Umwandlung von kW in Wh und Formatierung
  );
};

export default TodayConsumptionDisplay;
