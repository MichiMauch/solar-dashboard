import axios from 'axios';
import getToken from '../../src/lib/getToken';

const getTimestampsForLastFiveDays = () => {
    const days = [];
    for (let i = 1; i <= 7; i++) {  // Startet bei 1, um den aktuellen Tag auszuschließen
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);  // Setzt die Uhrzeit auf den Beginn des Tages
      const start = Math.floor(date.getTime() / 1000);
      date.setHours(23, 59, 59, 999);  // Setzt die Uhrzeit auf das Ende des Tages
      const end = Math.floor(date.getTime() / 1000);
      days.push({ start, end });
    }
    return days;  // Kein 'reverse()', da neueste Tage zuerst angezeigt werden sollen
  };
  

export default async function handler(req, res) {
  const timestamps = getTimestampsForLastFiveDays();
  const accessToken = await getToken();
  const config = {
    headers: { 'x-authorization': `Bearer ${accessToken}` }
  };

  try {
    const results = await Promise.all(
      timestamps.map(async ({ start, end }) => {
        const response = await axios.get(`https://vrmapi.victronenergy.com/v2/installations/193415/stats?interval=days&start=${start}&end=${end}`, config);
        return response.data.records.total_solar_yield.map(item => ({ timestamp: item[0], total_solar_yield: item[1] }));
      })
    );
    res.status(200).json(results.flat());  // Flatten the results to a single array
  } catch (error) {
    console.error('Fehler beim Abrufen der historischen Solar-Daten:', error);
    res.status(500).json({ message: 'Fehler beim Abrufen der historischen Daten', error });
  }
}
