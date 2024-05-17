// pages/api/autarkie.js
import axios from 'axios';
import getToken from '../../src/lib/getToken';

// Funktion, um die Zeitstempel für den Start und das Ende jedes Monats des aktuellen Jahres zu generieren
const getCurrentYearMonthlyTimestamps = () => {
  const dates = [];
  const today = new Date();
  const year = today.getFullYear();

  for (let month = 0; month < 12; month++) {
    const startOfMonth = new Date(year, month, 1).getTime(); // Erster Tag des Monats
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999).getTime(); // Letzter Tag des Monats
    dates.push({ start: Math.floor(startOfMonth / 1000), end: Math.floor(endOfMonth / 1000) });
  }

  return dates;
};

export default async function handler(req, res) {
  console.log('Handler reached for Autarkie data');
  const timestamps = getCurrentYearMonthlyTimestamps();
  console.log('Timestamps for each month of the current year:', timestamps);
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
        return response.data.records;
      })
    );

    // Summiere die monatlichen Ergebnisse
    let totalSolarYield = 0;
    let totalConsumption = 0;
    let gridHistoryFrom = 0;

    results.forEach(records => {
      if (records.total_solar_yield) {
        totalSolarYield += records.total_solar_yield[0][1];
      }
      if (records.total_consumption) {
        totalConsumption += records.total_consumption[0][1];
      }
      if (records.grid_history_from) {
        gridHistoryFrom += records.grid_history_from[0][1];
      }
    });

    const autarkie = (totalConsumption - gridHistoryFrom) / totalConsumption * 100;

    res.status(200).json({
      total_solar_yield: totalSolarYield,
      total_consumption: totalConsumption,
      grid_history_from: gridHistoryFrom,
      autarkie: autarkie.toFixed(2) // Autarkie in Prozent mit zwei Dezimalstellen
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Daten:', error);
    res.status(500).json({ message: 'Fehler beim Abrufen der historischen Daten', error });
  }
}
