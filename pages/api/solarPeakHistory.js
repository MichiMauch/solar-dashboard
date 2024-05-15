import axios from 'axios';
import getToken from '../../src/lib/getToken';

// Funktion zur Generierung von Zeitstempeln für den Beginn und das Ende der letzten 30 Tage
const getTimestampsForLast30Days = () => {
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Setzt die Uhrzeit auf Mitternacht
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const start = Math.floor(date.getTime() / 1000); // Start des Tages in Sekunden
    date.setHours(23, 59, 59, 999); // Ende des Tages
    const end = Math.floor(date.getTime() / 1000); // Ende des Tages in Sekunden
    days.unshift({ start, end }); // Fügt am Anfang ein, um die Reihenfolge von heute rückwärts zu haben
  }
  return days;
};

export default async function handler(req, res) {
  const timestamps = getTimestampsForLast30Days();
  let accessToken;

  try {
    accessToken = await getToken();
    console.log('Access Token:', accessToken);
  } catch (error) {
    console.error('Fehler beim Abrufen des API-Tokens:', error.message);
    return res.status(500).json({ message: 'Fehler beim Abrufen des API-Tokens', error: error.message });
  }

  const config = {
    headers: { 'x-authorization': `Bearer ${accessToken}` }
  };

  try {
    const results = await Promise.all(
      timestamps.map(async ({ start, end }) => {
        const url = `https://vrmapi.victronenergy.com/v2/installations/193415/stats?interval=15mins&start=${start}&end=${end}`;
        console.log('API Request URL:', url); // Logge die API-URL
        
        const response = await axios.get(url, config);
        console.log('API Response:', response.data); // Logge die API-Antwort

        const records = response.data.records;
        
        // Berechnen des höchsten Pdc-Werts für den Tag
        const peakPowerEntry = records.Pdc
          ? records.Pdc.reduce((max, entry) => (entry[1] > max[1] ? entry : max), [0, 0])
          : [0, 0];

        return { timestamp: peakPowerEntry[0], peak_power: peakPowerEntry[1] }; // Return timestamp in milliseconds
      })
    );
    res.status(200).json(results);
  } catch (error) {
    console.error('Fehler beim Abrufen der Daten:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Fehler beim Abrufen der historischen Daten', error: error.response ? error.response.data : error.message });
  }
}
