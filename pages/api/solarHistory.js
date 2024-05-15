import axios from 'axios';
import getToken from '../../src/lib/getToken';

// Funktion zur Generierung von Zeitstempeln für den Beginn und das Ende des Tages, für die letzten sieben Tage
const getTimestampsForLastSevenDays = () => {
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Setzt die Uhrzeit auf Mitternacht
  for (let i = 0; i < 7; i++) {
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
  const timestamps = getTimestampsForLastSevenDays();
  const accessToken = await getToken();
  const config = {
    headers: { 'x-authorization': `Bearer ${accessToken}` }
  };

  try {
    const results = await Promise.all(
      timestamps.map(async ({ start, end }) => {
        const response = await axios.get(`https://vrmapi.victronenergy.com/v2/installations/193415/stats?interval=days&start=${start}&end=${end}`, config);
        
        // Daten abrufen
        const totalSolarYield = response.data.records.total_solar_yield
          ? response.data.records.total_solar_yield[0][1]
          : 0;
        const totalConsumption = response.data.records.total_consumption
          ? response.data.records.total_consumption[0][1]
          : 0;
        
        // Zusätzliche Datenfelder
        const averagePower = response.data.records.average_power
          ? response.data.records.average_power[0][1]
          : 0;
        const peakPower = response.data.records.peak_power
          ? response.data.records.peak_power[0][1]
          : 0;
        const totalEnergyImported = response.data.records.total_energy_imported
          ? response.data.records.total_energy_imported[0][1]
          : 0;
        const totalEnergyExported = response.data.records.total_energy_exported
          ? response.data.records.total_energy_exported[0][1]
          : 0;
        
        return {
          timestamp: start * 1000,
          total_solar_yield: totalSolarYield,
          total_consumption: totalConsumption,
          average_power: averagePower,
          peak_power: peakPower,
          total_energy_imported: totalEnergyImported,
          total_energy_exported: totalEnergyExported
        };
      })
    );
    res.status(200).json(results);
  } catch (error) {
    console.error('Fehler beim Abrufen der Daten:', error);
    res.status(500).json({ message: 'Fehler beim Abrufen der historischen Daten', error });
  }
}
