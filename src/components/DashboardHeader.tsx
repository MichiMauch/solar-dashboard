import React, { useEffect, useState } from 'react';

// Definiere ein Interface für die Props
interface DashboardHeaderProps {
    currentTime: string;
}

const DashboardHeader = ({ currentTime }: DashboardHeaderProps) => {
    const [weather, setWeather] = useState<{ temperature: number | null; icon: string | null }>({ temperature: null, icon: null });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await fetch('/api/weather');
                const data = await response.json();

                if (response.ok) {
                    setWeather({
                        temperature: data.temperature,
                        icon: data.icon,
                    });
                } else {
                    setError(data.message);
                }
            } catch (error) {
                setError('Fehler beim Abrufen der Wetterdaten.');
            }
        };

        fetchWeather();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center gap-3">
            <h1 className="text-5xl text-center md:text-left text-transparent bg-clip-text bg-gradient-to-br from-purple-400 via-blue-400 to-blue-500">
                KOKOMO Dashboard - {currentTime}
            </h1>
            <div className="flex items-center gap-3">
                {weather.icon && (
                    <img
                        id="weather-icon"
                        className="w-24 h-24 -my-2"
                        src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                        alt="Weather Icon"
                    />
                )}
                {weather.temperature !== null && (
                    <span id="temperature" className="text-xl text-white">
                        {weather.temperature.toFixed(1)}°C
                    </span>
                )}
                {error && <span className="ml-2 text-red-500">{error}</span>}
            </div>
            <p className="text-white text-center md:text-left">
                Die Daten werden alle 5 Sekunden aktualisiert, mit einer Verzögerung von 15 Minuten.
            </p>
        </div>
    );
};

export default DashboardHeader;
