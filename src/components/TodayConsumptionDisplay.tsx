import React from 'react';

interface TodayConsumptionDisplayProps {
  records: Array<[number, number]>;
}

const TodayConsumptionDisplay: React.FC<TodayConsumptionDisplayProps> = ({ records }) => {
  const today = new Date().setHours(0, 0, 0, 0); // Setzt die heutige Zeit auf Mitternacht

  const totalConsumption = records.reduce((sum, record) => {
    const recordDate = new Date(record[0]).setHours(0, 0, 0, 0);
    if (recordDate === today) {
      return sum + record[1];
    }
    return sum;
  }, 0);

  return (
    <div className="relative flex flex-col text-gray-700 bg-white shadow-md w-96 rounded-xl bg-clip-border max-w-full">
    <nav className="flex min-w-[240px] flex-col gap-1 p-2 font-sans text-base font-normal text-blue-gray-700">
        <div role="button" className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900">
          <div className="text-lg mt-1">Heutiger Stromverbrauch</div> 
            <div className="grid ml-auto place-items-center justify-self-end">
              <div className="relative grid items-center px-2 py-1 font-sans text-m font-bold text-gray-900 rounded-full select-none whitespace-nowrap bg-orange-600/30">
                <span className="">{(totalConsumption).toFixed(2)} kWh</span>
              </div>
            </div>
          </div> 
    </nav>
  </div>
  );
};

export default TodayConsumptionDisplay;