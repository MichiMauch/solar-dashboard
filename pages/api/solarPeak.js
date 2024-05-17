import axios from 'axios';
import getToken from '../../src/lib/getToken';

// Funktion zur Generierung des Zeitstempels für den Beginn des aktuellen Tages
const getTimestampForToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Setzt die Uhrzeit auf Mitternacht
  const start = Math.floor(today.getTime() / 1000); // Start des Tages in Sekunden
  return start;
};

export default async function handler(req, res) {
  const start = getTimestampForToday();
  const interval = '15mins';
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
    const url = `https://vrmapi.victronenergy.com/v2/installations/193415/stats?interval=${interval}&start=${start}&type=live_feed`;
    console.log('API Request URL:', url); // Logge die API-URL
    
    const response = await axios.get(url, config);
    console.log('API Response:', response.data); // Logge die API-Antwort

    const records = response.data.records;
    
    // Berechnen des höchsten Pdc-Werts für den Tag
    const peakPowerEntry = records.Pdc
      ? records.Pdc.reduce((max, entry) => (entry[1] > max[1] ? entry : max), [0, 0])
      : [0, 0];

    const peakTimestamp = peakPowerEntry[0];
    const peakPower = peakPowerEntry[1];

    console.log('Peak Timestamp (UTC):', new Date(peakTimestamp * 1000).toISOString());
    console.log('Peak Power:', peakPower);

    return res.status(200).json({ timestamp: peakTimestamp, peak_power: peakPower });
  } catch (error) {
    console.error('Fehler beim Abrufen der Daten:', error.response ? error.response.data : error.message);
    return res.status(500).json({ message: 'Fehler beim Abrufen der historischen Daten', error: error.response ? error.response.data : error.message });
  }
}
