import React from 'react';

interface BatteryDisplayProps {
  batteryStatus: Array<[number, number, number, number]>; // Daten des Batteriestatus
}

const BatteryDisplay: React.FC<BatteryDisplayProps> = ({ batteryStatus }) => {
  const lastBatteryEntry = batteryStatus[batteryStatus.length - 1];
  const charge = lastBatteryEntry ? lastBatteryEntry[1] : null; // Nehmen Sie an, dass der Ladezustand im zweiten Feld gespeichert ist

  const radius = 120; // Radius des Kreises
  const strokeWidth = 30; // Dicke des Kreisbalkens
  const circumference = 2 * Math.PI * radius; // Umfang des Kreises

  return charge !== null ? (
<div className="relative flex items-center justify-center h-full bg-white shadow-md rounded-xl bg-clip-border p-4">
  <svg width="100%" height="100%" viewBox="0 0 300 300" className="transform -rotate-90">
    <circle
      cx="150"
      cy="150"
      r={radius}
      strokeWidth={strokeWidth}
      stroke="#4B5563"
      fill="transparent"
    />
    <circle
      cx="150"
      cy="150"
      r={radius}
      strokeWidth={strokeWidth}
      stroke="#10B981"
      fill="transparent"
      strokeDasharray={circumference}
      strokeDashoffset={circumference - (charge / 100) * circumference}
    />
  </svg>
  <div className="absolute flex flex-col items-center justify-center" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
    <span className="text-3xl text-black">
      {`${charge.toFixed(2)}%`}
    </span>
    <div className="text-lg text-black mt-1 text-sm">Batterieladung</div>
  </div>
</div>


  ) : (
    <p>Batterieladung wird geladen...</p>
  );
};

export default BatteryDisplay;
