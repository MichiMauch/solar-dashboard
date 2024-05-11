import axios from 'axios';
import getToken from '../../src/lib/getToken';

const getLastTwentyFourMonthsTimestamps = () => {
    const dates = [];
    const today = new Date();
    today.setDate(1); // Setzt auf den ersten Tag des Monats und berücksichtigt nicht den aktuellen Monat
    today.setHours(0, 0, 0, 0);
  
    for (let i = 23; i >= 0; i--) {
      const monthOffset = today.getMonth() - i;
      const date = new Date(today.getFullYear(), monthOffset, 1);
      const start = date.getTime();
      date.setMonth(date.getMonth() + 1, 0);
      date.setHours(23, 59, 59, 999);
      const end = date.getTime();
      dates.push({ start: Math.floor(start / 1000), end: Math.floor(end / 1000) });
    }
    return dates;
};

export default async function handler(req, res) {
  const timestamps = getLastTwentyFourMonthsTimestamps();
  const accessToken = await getToken();
  const config = { headers: { 'x-authorization': `Bearer ${accessToken}` } };

  try {
    const results = await Promise.all(
      timestamps.map(async ({ start, end }) => {
        const response = await axios.get(`https://vrmapi.victronenergy.com/v2/installations/193415/stats?interval=months&start=${start}&end=${end}`, config);
        const totalSolarYield = response.data.records?.total_solar_yield?.[0]?.[1] ?? 0;
        return { timestamp: start, total_solar_yield: totalSolarYield };
      })
    );
    res.status(200).json(results);
  } catch (error) {
    console.error('Fehler beim Abrufen der Daten:', error);
    res.status(500).json({ message: 'Fehler beim Abrufen der historischen Daten', error });
  }
}
