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
    <div className="relative flex flex-col text-gray-700 bg-white shadow-md w-96 max-w-full rounded-xl bg-clip-border">
    <nav className="flex min-w-[240px] flex-col gap-1 p-2 font-sans text-base font-normal text-blue-gray-700">
        <div role="button" className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900">
          <div className="text-lg mt-1">Heutige Stromgenerierung</div> 
            <div className="grid ml-auto place-items-center justify-self-end">
              <div className="relative grid items-center px-2 py-1 font-sans text-m font-bold text-gray-900 rounded-full select-none whitespace-nowrap bg-blue-600/30">
                <span className="">{todayProductionSum.toFixed(2)} kWh</span>
              </div>
            </div>
          </div> 
    </nav>
  </div>
    
  );
};

export default TodayProductionDisplay;

