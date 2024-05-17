import React, { useEffect } from 'react';

interface BatteryDisplayProps {
  batteryStatus: Array<[number, number, number, number]>; // Daten des Batteriestatus
}

const BatteryDisplay: React.FC<BatteryDisplayProps> = ({ batteryStatus }) => {
  const lastBatteryEntry = batteryStatus[batteryStatus.length - 1];
  const charge = lastBatteryEntry ? lastBatteryEntry[1] : 0; // Nehmen Sie an, dass der Ladezustand im zweiten Feld gespeichert ist

  const radius = 80; // Radius des Kreises
  const strokeWidth = 25; // Dicke des Kreisbalkens
  const circumference = 2 * Math.PI * radius; // Umfang des Kreises

  // Der rote Abschnitt ist 90 Grad (von 0 bis 90 Grad)
  const redSectionDegrees = 90;
  const redSectionFraction = redSectionDegrees / 360;
  const redDasharray = circumference * redSectionFraction;

  // Der orange Abschnitt ist 125 Grad (von 91 bis 216 Grad)
  const orangeSectionDegrees = 125;
  const orangeSectionFraction = orangeSectionDegrees / 360;
  const orangeDasharray = circumference * orangeSectionFraction;

  // Der grüne Abschnitt ist 144 Grad (von 216 bis 360 Grad)
  const greenSectionDegrees = 144;
  const greenSectionFraction = greenSectionDegrees / 360;
  const greenDasharray = circumference * greenSectionFraction;

  // Positionen der Markierungen für 25% und 60%, um 90 Grad korrigiert
  const position25 = 25 * 3.6; // 25% * 3.6 Grad pro Prozent + 90 Grad
  const position60 = 60 * 3.6; // 60% * 3.6 Grad pro Prozent + 90 Grad
  const position100 = 100 * 3.6; // 100% * 3.6 Grad pro Prozent + 90 Grad
  const positionCharge = charge * 3.6 -1; // Ladezustand in Grad um 90 Grad korrigiert

  // Berechnungen für die Markierungen
  const markX = (angle: number) => 100 + (radius - strokeWidth / 100) * Math.cos((angle * Math.PI) / 180);
  const markY = (angle: number) => 100 + (radius - strokeWidth / 100) * Math.sin((angle * Math.PI) / 180);

  // Berechnungen für den kleinen Kreis innerhalb des Hauptkreises
  const innerMarkX = (angle: number) => 100 + radius * Math.cos((angle * Math.PI) / 180);
  const innerMarkY = (angle: number) => 100 + radius * Math.sin((angle * Math.PI) / 180);

  useEffect(() => {
    console.log('25% Position:', { x: markX(position25), y: markY(position25) });
    console.log('60% Position:', { x: markX(position60), y: markY(position60) });
    console.log('100% Position:', { x: markX(position100), y: markY(position100) });
    console.log('Charge Position:', { x: innerMarkX(positionCharge), y: innerMarkY(positionCharge) });
  }, [position25, position60, position100, positionCharge]);

  return charge !== null ? (
    <div className="relative flex items-center justify-center h-full bg-white shadow-md rounded-xl bg-clip-border p-4 hover:bg-gradient-to-br hover:from-purple-400 hover:via-blue-400 hover:to-blue-500 duration-300 hover:shadow-2xl group">
      <svg width="100%" height="100%" viewBox="0 0 200 200" className="transform -rotate-90">
        {/* Hintergrundkreis */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          strokeWidth={strokeWidth}
          stroke="#E5E7EB"
          fill="transparent"
        />

        {/* Roter Kreis (0-90 Grad) */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          strokeWidth={strokeWidth}
          stroke="#EF4444"
          fill="transparent"
          strokeDasharray={`${redDasharray} ${circumference}`}
          strokeDashoffset={0}
        />

        {/* Oranger Kreis (91-216 Grad) */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          strokeWidth={strokeWidth}
          stroke="#F59E0B"
          fill="transparent"
          strokeDasharray={`${orangeDasharray} ${circumference}`}
          strokeDashoffset={-redDasharray}
        />

        {/* Grüner Kreis (216-360 Grad) */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          strokeWidth={strokeWidth}
          stroke="#34D399"
          fill="transparent"
          strokeDasharray={`${greenDasharray} ${circumference}`}
          strokeDashoffset={-(redDasharray + orangeDasharray)}
        />

        {/* Markierungen für 25% und 60% */}
        <text x={markX(position25)} y={markY(position25)} textAnchor="middle" fill="black" fontSize="12" dy=".3em" transform={`rotate(${position25} ${markX(position25)} ${markY(position25)})`}>
          25%
        </text>
        <text
          x={markX(position60)}
          y={markY(position60)}
          textAnchor="middle"
          fill="black"
          fontSize="12"
          dy=".3em"
          transform={`rotate(${position60 + (position60 > 180 ? 180 : 0)} ${markX(position60)} ${markY(position60)})`}
        >
          60%
        </text>
        <text
          x={markX(position100)}
          y={markY(position100)}
          textAnchor="middle"
          fill="black"
          fontSize="12"
          dy=".3em"
          transform={`rotate(90 ${markX(position100)} ${markY(position100)})`}
        >
          100%
        </text>


        {/* Kleiner Kreis für den aktuellen Ladezustand */}
        <circle
          cx={innerMarkX(positionCharge)}
          cy={innerMarkY(positionCharge)}
          r="8"
          fill="black"
        />
      </svg>
      <div
        className="absolute flex flex-col items-center justify-center"
        style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
      >
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
