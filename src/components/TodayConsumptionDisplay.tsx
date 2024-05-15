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
    <div
        className="flex flex-col px-4 py-4 overflow-hidden bg-white hover:bg-gradient-to-br hover:from-purple-400 hover:via-blue-400 hover:to-blue-500 rounded-xl shadow-lg duration-300 hover:shadow-2xl group">
        <div className="flex flex-row justify-between items-center">
          <div className="px-4 py-4 bg-gray-300  rounded-xl bg-opacity-30">
            <i className="fa-solid fa-plug-circle-bolt text-red-500 text-3xl"></i>
          </div>
          
        </div>
        <h1 className="text-3xl sm:text-4xl xl:text-5xl font-bold text-gray-700 mt-6 group-hover:text-gray-50">{(totalConsumption).toFixed(2)} kWh</h1>
        <div className="flex flex-row justify-between text-gray-700 group-hover:text-gray-200">
          <p>Heutiger Stromverbrauch</p>
        </div>
      </div>
  );
};

export default TodayConsumptionDisplay;

