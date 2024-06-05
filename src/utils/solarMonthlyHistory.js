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

const getLastMonthTimestamp = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Setzt die Uhrzeit auf Mitternacht

  const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59, 999);

  return {
    start: Math.floor(startOfLastMonth.getTime() / 1000),
    end: Math.floor(endOfLastMonth.getTime() / 1000)
  };
};

export const getLastMonthSolarStats = async () => {
  const { start, end } = getLastMonthTimestamp();
  const accessToken = await getToken();
  const config = {
    headers: { 'x-authorization': `Bearer ${accessToken}` }
  };

  try {
    const response = await axios.get(`https://vrmapi.victronenergy.com/v2/installations/193415/stats?interval=months&start=${start}&end=${end}`, config);
    const totalSolarYield = response.data.records && response.data.records.total_solar_yield
      ? Math.ceil(response.data.records.total_solar_yield[0][1]) // Aufrunden auf eine ganze Zahl
      : 0;
    const totalConsumption = response.data.records && response.data.records.total_consumption
      ? Math.ceil(response.data.records.total_consumption[0][1]) // Aufrunden auf eine ganze Zahl
      : 0;
    return { totalSolarYield, totalConsumption };
  } catch (error) {
    console.error('Fehler beim Abrufen der Daten:', error);
    throw new Error('Fehler beim Abrufen der historischen Daten');
  }
};

export const getPeakDay = async () => {
  const timestamps = getTimestampsForLast30Days();
  let accessToken;

  try {
    accessToken = await getToken();
    console.log('Access Token:', accessToken);
  } catch (error) {
    console.error('Fehler beim Abrufen des API-Tokens:', error.message);
    throw new Error('Fehler beim Abrufen des API-Tokens');
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

        return { date: new Date(start * 1000), peak_power: peakPowerEntry[1] }; // Return date and peak power
      })
    );

    // Finde den Tag mit dem höchsten Peak
    const peakDay = results.reduce((max, entry) => (entry.peak_power > max.peak_power ? entry : max), { date: null, peak_power: 0 });

    return peakDay;
  } catch (error) {
    console.error('Fehler beim Abrufen der Daten:', error.response ? error.response.data : error.message);
    throw new Error('Fehler beim Abrufen der historischen Daten');
  }
};

// Neue Funktion zur Berechnung des Autarkie-Werts des aktuellen Jahres bis einschließlich des letzten Monats und des Unterschieds zum Vormonat
const getCurrentYearMonthlyTimestamps = () => {
  const dates = [];
  const today = new Date();
  const year = today.getFullYear();

  for (let month = 0; month < today.getMonth(); month++) {
    const startOfMonth = new Date(year, month, 1).getTime(); // Erster Tag des Monats
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999).getTime(); // Letzter Tag des Monats
    dates.push({ start: Math.floor(startOfMonth / 1000), end: Math.floor(endOfMonth / 1000) });
  }

  return dates;
};

export const getAutarkieStats = async () => {
  const timestamps = getCurrentYearMonthlyTimestamps();
  const accessToken = await getToken();
  const config = {
    headers: { 'x-authorization': `Bearer ${accessToken}` }
  };

  try {
    const results = await Promise.all(
      timestamps.map(async ({ start, end }) => {
        const response = await axios.get(`https://vrmapi.victronenergy.com/v2/installations/193415/stats?interval=months&start=${start}&end=${end}`, config);
        return response.data.records;
      })
    );

    // Summiere die monatlichen Ergebnisse
    let totalSolarYield = 0;
    let totalConsumption = 0;
    let gridHistoryFrom = 0;
    let previousMonthAutarkie = null;

    results.forEach((records, index) => {
      if (records.total_solar_yield) {
        totalSolarYield += records.total_solar_yield[0][1];
      }
      if (records.total_consumption) {
        totalConsumption += records.total_consumption[0][1];
      }
      if (records.grid_history_from) {
        gridHistoryFrom += records.grid_history_from[0][1];
      }

      // Berechne den Autarkie-Wert für den Vormonat
      if (index === results.length - 2) {
        previousMonthAutarkie = (totalConsumption - gridHistoryFrom) / totalConsumption * 100;
      }
    });

    const autarkie = (totalConsumption - gridHistoryFrom) / totalConsumption * 100;
    const autarkieDifference = previousMonthAutarkie ? (autarkie - previousMonthAutarkie).toFixed(2) : null;

    return {
      total_solar_yield: totalSolarYield,
      total_consumption: totalConsumption,
      grid_history_from: gridHistoryFrom,
      autarkie: autarkie.toFixed(2), // Autarkie in Prozent mit zwei Dezimalstellen
      autarkieDifference
    };
  } catch (error) {
    console.error('Fehler beim Abrufen der Daten:', error);
    throw new Error('Fehler beim Abrufen der Autarkie-Daten');
  }
};

// Neue Funktion zur Berechnung des extern bezogenen Stroms im letzten Monat
export const getLastMonthGridUsage = async () => {
  const { start, end } = getLastMonthTimestamp();
  const accessToken = await getToken();
  const config = {
    headers: { 'x-authorization': `Bearer ${accessToken}` }
  };

  try {
    const response = await axios.get(`https://vrmapi.victronenergy.com/v2/installations/193415/stats?interval=months&start=${start}&end=${end}`, config);
    const gridHistoryFrom = response.data.records && response.data.records.grid_history_from
      ? Math.ceil(response.data.records.grid_history_from[0][1]) // Aufrunden auf eine ganze Zahl
      : 0;
    return gridHistoryFrom;
  } catch (error) {
    console.error('Fehler beim Abrufen der Daten:', error);
    throw new Error('Fehler beim Abrufen der Grid Usage-Daten');
  }
};
