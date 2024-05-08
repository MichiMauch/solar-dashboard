import React from 'react';

// Definiere ein Interface für die Props
interface DashboardHeaderProps {
    currentTime: string;
}

const DashboardHeader = ({ currentTime }: DashboardHeaderProps) => {
    return (
        <div className="container mx-auto w-5/6">
            <h1>
                <div className="text-5xl font-bold leading-normal inline box-decoration-clone bg-slate-500 text-gray-100 p-4 [filter:url('#goo')]" contentEditable={true}>
                Solaranlagen Dashboard - {currentTime}
                </div>
            </h1>
            {/* Zusätzlicher Text außerhalb des visuellen Rahmens des h1-Tags */}
            <p className="text-gray-700 mt-4 ml-4">
                Die Daten werden alle 5 Sekunden aktualisiert, mit einer Verzögerung von 15 Minuten.
            </p>
            <svg style={{ visibility: 'hidden', position: 'absolute' }} width="0" height="0" xmlns="http://www.w3.org/2000/svg" version="1.1">
                <defs>
                <filter id="goo">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
                    <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
                </filter>
                </defs>
            </svg>
        </div>
    );
};

export default DashboardHeader;


/* Ändere die Komponente, um einen Prop für currentTime zu akzeptieren
const DashboardHeader = ({ currentTime }: DashboardHeaderProps) => {
    return (
    <div className="text-center p-4">
      <h1 className="text-3xl font-bold text-gray-700">
        Solaranlagen Dashboard - {currentTime}
      </h1>
      <p>Die Webseite aktualisiert die Daten alle 5 Sekunden, wobei die angezeigten Informationen eine Verzögerung von 15 Minuten aufweisen.</p>
    </div>
  );
};
*/