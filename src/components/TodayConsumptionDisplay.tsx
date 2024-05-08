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
    <>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css" rel="stylesheet" />

      <div className="flex w-full">
        <div className="flex-1 m-5 relative rounded bg-gray-200 shadow">
            <div className="bg-green-500 p-2 ml-3 absolute top-0 -mt-4 -mr-4 rounded text-white fill-current shadow flex items-center justify-center" style={{ width: '50px', height: '50px' }}>
                <i className="fas fa-plug text-2xl inline-block w-5"></i>
            </div>
  
            <div className="float-right top-0 right-0 m-3">
                <div className="text-right text-sm text-black">Heutiger Stromverbrauch in kWh</div>
                <div className="text-right text-3xl text-black">{(totalConsumption).toFixed(2)}</div>
            </div>
        </div>
      </div>
    </>
  );
};

export default TodayConsumptionDisplay;