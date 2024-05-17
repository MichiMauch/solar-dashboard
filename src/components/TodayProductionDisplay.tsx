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
    <div
        className="flex flex-col px-4 py-4 overflow-hidden bg-white hover:bg-gradient-to-br hover:from-purple-400 hover:via-blue-400 hover:to-blue-500 rounded-xl shadow-lg duration-300 hover:shadow-2xl group">
        <div className="flex flex-row justify-between items-center">
          <div className="px-4 py-4 bg-gray-300  rounded-xl bg-opacity-30">
            <i className="fa-solid fa-solar-panel text-blue-500 text-3xl"></i>
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl xl:text-5xl font-bold text-gray-700 mt-6 group-hover:text-gray-50">{todayProductionSum.toFixed(2)} kWh</h1>
        <div className="flex flex-row justify-between text-gray-700 group-hover:text-gray-200">
          <p>Heutige Stromproduktion</p>
        </div>
      </div>
    
  );
};

export default TodayProductionDisplay;

      
    