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
    <>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css" rel="stylesheet" />

      <div className="flex w-full">
        <div className="flex-1 m-5 relative rounded bg-gray-200 shadow">
          {/* Quadratisches, kleineres orangefarbenes Viereck mit zentriertem Icon */}
          <div className="bg-orange-500 p-2 ml-3 absolute top-0 -mt-4 -mr-4 rounded text-white fill-current shadow flex items-center justify-center" style={{ width: '50px', height: '50px' }}>
            <i className="fas fa-solar-panel text-2xl"></i>
          </div>

          <div className="float-right top-0 right-0 m-3">
            <div className="text-right text-sm text-black">Heutige Stromgenerierung in kWh</div>
            <div className="text-right text-3xl text-black">{todayProductionSum.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TodayProductionDisplay;

