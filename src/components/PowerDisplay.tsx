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
    <>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css" rel="stylesheet" />

      <div className="flex w-full">
        <div className="flex-1 m-5 relative rounded bg-gray-200 shadow">
            <div className="bg-yellow-500 p-2 ml-3 absolute top-0 -mt-4 -mr-4 rounded text-white fill-current shadow flex items-center justify-center" style={{ width: '50px', height: '50px' }}>
                <i className="fas fa-sun text-2xl inline-block w-5"></i>
            </div>
  
            <div className="float-right top-0 right-0 m-3">
                <div className="text-right text-sm text-black">Aktuelle Stromgenerierung in Watt</div>
                <div className="text-right text-3xl text-black">{power.toFixed(2)}</div>
            </div>
        </div>
      </div>
    </>
  );
};

export default PowerDisplay;
