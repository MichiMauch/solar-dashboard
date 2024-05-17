// pages/api/weather.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const lat = 47.3388658;
    const lon = 8.0503249;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (response.ok) {
            res.status(200).json({
                temperature: data.main.temp,
                icon: data.weather[0].icon,
            });
        } else {
            res.status(response.status).json({ message: data.message });
        }
    } catch (error) {
        res.status(500).json({ message: 'Fehler beim Abrufen der Wetterdaten.' });
    }
}
