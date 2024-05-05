// src/components/CurrentConsumptionDisplay.tsx
import React from 'react';

interface CurrentConsumptionDisplayProps {
  consumption: number;  // Der aktuelle Energieverbrauch
}

const CurrentConsumptionDisplay: React.FC<CurrentConsumptionDisplayProps> = ({ consumption }) => (
  <p>Aktuelle Last: {consumption.toFixed(2)} Wh</p>
);

export default CurrentConsumptionDisplay;
