import React from 'react';

interface PowerDisplayProps {
  powerData: Array<[number, number]>;
  onTimeUpdate: (time: string) => void;  // Callback-Funktion hinzufügen
}

const PowerDisplay: React.FC<PowerDisplayProps> = ({ powerData, onTimeUpdate }) => {
  // Letzten Eintrag der Leistung ermitteln
  const lastPowerEntry = powerData[powerData.length - 1];
  const time = lastPowerEntry ? new Date(lastPowerEntry[0]).toLocaleTimeString() : '';
  const power = lastPowerEntry ? lastPowerEntry[1] : 0;

  // Aktualisiere die Zeit über den Callback
  React.useEffect(() => {
    onTimeUpdate(time);
  }, [time, onTimeUpdate]);

  return (
  <div className="flex flex-col px-4 py-4 overflow-hidden bg-white hover:bg-gradient-to-br hover:from-purple-400 hover:via-blue-400 hover:to-blue-500 rounded-xl shadow-lg duration-300 hover:shadow-2xl group">
      <div className="flex flex-row justify-between items-center">
        <div className="px-4 py-4 bg-gray-300 rounded-xl bg-opacity-30">
          <i className="fa-solid fa-sun text-yellow-500 text-3xl"></i>
        </div>
      </div>
      <h1 className="text-3xl sm:text-4xl xl:text-5xl font-bold text-gray-700 mt-6 group-hover:text-gray-50">{power.toFixed(2)} W</h1>
      <div className="flex flex-row justify-between text-gray-700 group-hover:text-gray-200">
        <p>Aktuelle Stromproduktion</p>
      </div>
  </div>
  );
};

export default PowerDisplay;

