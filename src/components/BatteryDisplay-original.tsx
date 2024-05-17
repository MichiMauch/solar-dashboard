import React from 'react';

interface BatteryDisplayProps {
  batteryStatus: Array<[number, number, number, number]>; // Daten des Batteriestatus
}

const BatteryDisplay: React.FC<BatteryDisplayProps> = ({ batteryStatus }) => {
  const lastBatteryEntry = batteryStatus[batteryStatus.length - 1];
  const charge = lastBatteryEntry ? lastBatteryEntry[1] : null; // Nehmen Sie an, dass der Ladezustand im zweiten Feld gespeichert ist

  const radius = 80; // Reduzieren Sie den Radius des Kreises, um die Höhe der Box anzupassen
  const strokeWidth = 25; // Dicke des Kreisbalkens
  const circumference = 2 * Math.PI * radius; // Umfang des Kreises

  return charge !== null ? (
    <div className="relative flex items-center justify-center h-full bg-white shadow-md rounded-xl bg-clip-border p-4 hover:bg-gradient-to-br hover:from-purple-400 hover:via-blue-400 hover:to-blue-500 duration-300 hover:shadow-2xl group">
      <svg width="100%" height="100%" viewBox="0 0 200 200" className="transform -rotate-90">
        <circle
          cx="100"
          cy="100"
          r={radius}
          strokeWidth={strokeWidth}
          stroke="#4B5563"
          fill="transparent"
        />
        <circle
          cx="100"
          cy="100"
          r={radius}
          strokeWidth={strokeWidth}
          stroke="#34D399"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (charge / 100) * circumference}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
        <span className="text-3xl sm:text-4xl xl:text-5xl font-bold text-gray-700 mt-6 group-hover:text-gray-50">
          {`${charge.toFixed(2)}%`}
        </span>
        <div className="text-gray-700 group-hover:text-gray-200 mt-1">Batterieladung</div>
      </div>
    </div>
  ) : (
    <p>Batterieladung wird geladen...</p>
  );
};

export default BatteryDisplay;
