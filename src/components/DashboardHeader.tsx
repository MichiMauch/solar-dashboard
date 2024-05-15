import React from 'react';

// Definiere ein Interface für die Props
interface DashboardHeaderProps {
    currentTime: string;
}

const DashboardHeader = ({ currentTime }: DashboardHeaderProps) => {
    return (
        <div className="flex items-center justify-center flex-col gap-3">
  <h1 className="text-5xl text-transparent bg-clip-text bg-gradient-to-br from-purple-400 via-blue-400 to-blue-500">
    KOKOMO Dashboard - {currentTime}
  </h1>
  <p className="text-white">Die Daten werden alle 5 Sekunden aktualisiert, mit einer Verzögerung von 15 Minuten.</p>
</div>

    );
};

export default DashboardHeader;


