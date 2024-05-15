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
    <div className="relative flex flex-col text-gray-700 bg-white shadow-md w-96 rounded-xl bg-clip-border max-w-full">
    <nav className="flex min-w-[240px] flex-col gap-1 p-2 font-sans text-base font-normal text-blue-gray-700">
        <div role="button" className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900">
          <div className="text-lg mt-1">Aktuelle Stromproduktion</div> 
            <div className="grid ml-auto place-items-center justify-self-end">
              <div className="relative grid items-center px-2 py-1 font-sans text-m font-bold text-gray-900 rounded-full select-none whitespace-nowrap bg-yellow-600/50">
                <span className="">{power.toFixed(2)} W</span>
              </div>
            </div>
          </div> 
    </nav>
  </div>
  );
};

export default PowerDisplay;
