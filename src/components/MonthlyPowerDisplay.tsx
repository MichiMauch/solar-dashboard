// src/components/MonthlyPowerDisplay.tsx
import React from 'react';
import { calculateMonthlySums } from '../utils/calculateMonthlySums';

interface MonthlyPowerDisplayProps {
  powerData: Array<[number, number]>;
  onTimeUpdate: (time: string) => void;
}

const MonthlyPowerDisplay: React.FC<MonthlyPowerDisplayProps> = ({ powerData, onTimeUpdate }) => {
  const monthlySums = calculateMonthlySums(powerData);
  const lastMonthEntry = monthlySums[monthlySums.length - 1];
  const lastMonth = lastMonthEntry ? lastMonthEntry[0] : '';
  const lastMonthTotalPower = lastMonthEntry ? lastMonthEntry[1] : 0;

  React.useEffect(() => {
    onTimeUpdate(lastMonth);
  }, [lastMonth, onTimeUpdate]);

  return (
    <>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css" rel="stylesheet" />

      <div className="flex w-full">
        <div className="flex-1 m-5 relative rounded bg-gray-200 shadow">
          <div className="bg-blue-500 p-2 ml-3 absolute top-0 -mt-4 -mr-4 rounded text-white fill-current shadow flex items-center justify-center" style={{ width: '50px', height: '50px' }}>
            <i className="fas fa-chart-bar text-2xl inline-block w-5"></i>
          </div>

          <div className="float-right top-0 right-0 m-3">
            <div className="text-right text-sm text-black">Monatliche Stromerzeugung in kWh</div>
            <div className="text-right text-3xl text-black">{lastMonthTotalPower.toFixed(2)} kWh</div>
          </div>
        </div>
      </div>

      <ul>
        {monthlySums.map(([month, totalPower, difference], index) => (
          <li key={index} className="text-black">
            {month}: {totalPower.toFixed(2)} kWh 
            {index > 0 && (
              <span className={`ml-2 ${difference >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                ({difference >= 0 ? '+' : ''}{difference.toFixed(2)} kWh)
              </span>
            )}
          </li>
        ))}
      </ul>
    </>
  );
};

export default MonthlyPowerDisplay;
