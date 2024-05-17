import axios from 'axios';
import getToken from '../../src/lib/getToken';

// Funktion, um die Zeitstempel für den Start und das Ende der letzten 24 Monate zu generieren
const getLastTwentyFourMonthsTimestamps = () => {
  const dates = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Setzt die Uhrzeit auf Mitternacht

  for (let i = 23; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const start = date.getTime(); // Start des Monats
    date.setMonth(date.getMonth() + 1, 0); // Letzter Tag des Monats
    date.setHours(23, 59, 59, 999);
    const end = date.getTime();
    dates.push({ start: Math.floor(start / 1000), end: Math.floor(end / 1000) }); // Umwandlung in Sekunden
  }
  return dates.reverse();
};

export default async function handler(req, res) {
  console.log('Handler reached');
  const timestamps = getLastTwentyFourMonthsTimestamps();
  console.log('Timestamps:', timestamps);
  const accessToken = await getToken();
  console.log('Access token:', accessToken);
  const config = {
    headers: { 'x-authorization': `Bearer ${accessToken}` }
  };

  try {
    const results = await Promise.all(
      timestamps.map(async ({ start, end }) => {
        console.log(`Fetching data for range ${start} - ${end}`);
        const response = await axios.get(`https://vrmapi.victronenergy.com/v2/installations/193415/stats?interval=months&start=${start}&end=${end}`, config);
        console.log('Response:', response.data);
        const gridHistoryFrom = response.data.records && response.data.records.grid_history_from
          ? response.data.records.grid_history_from[0][1]
          : 0; // Strom von externer Quelle
        return {
          timestamp: start,
          grid_history_from: gridHistoryFrom
        };
      })
    );
    res.status(200).json(results);
  } catch (error) {
    console.error('Fehler beim Abrufen der Daten:', error);
    res.status(500).json({ message: 'Fehler beim Abrufen der historischen Daten', error });
  }
}
