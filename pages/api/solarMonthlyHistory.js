import axios from 'axios';
import getToken from '../../src/lib/getToken';

// Funktion, um die Zeitstempel für den Start und das Ende der letzten fünf Monate zu generieren
const getLastFiveMonthsTimestamps = () => {
    const dates = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Setzt die Uhrzeit auf Mitternacht
  
    for (let i = 5; i >= 0; i--) {
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
  const timestamps = getLastFiveMonthsTimestamps();
  const accessToken = await getToken();
  const config = {
    headers: { 'x-authorization': `Bearer ${accessToken}` }
  };

  // Im API Handler, um Daten für den Verbrauch zu integrieren
try {
  const results = await Promise.all(
    timestamps.map(async ({ start, end }) => {
      const response = await axios.get(`https://vrmapi.victronenergy.com/v2/installations/193415/stats?interval=months&start=${start}&end=${end}`, config);
      const totalSolarYield = response.data.records && response.data.records.total_solar_yield
        ? response.data.records.total_solar_yield[0][1]
        : 0;
      const totalConsumption = response.data.records && response.data.records.total_consumption
        ? response.data.records.total_consumption[0][1]
        : 0; // Annahme, dass das Feld so heißt
      return { timestamp: start, total_solar_yield: totalSolarYield, total_consumption: totalConsumption };
    })
  );
  res.status(200).json(results);
} catch (error) {
  console.error('Fehler beim Abrufen der Daten:', error);
  res.status(500).json({ message: 'Fehler beim Abrufen der historischen Daten', error });
}

}
