// pages/api/solar.js
/*
import axios from 'axios';

export default async function handler(req, res) {
  const url = 'https://vrmapi.victronenergy.com/v2/installations/193415/stats?interval=15mins&type=live_feed';
  const config = {
    headers: { 'x-authorization': `Bearer ${process.env.BEARER_TOKEN}` }
  };
  try {
    const response = await axios.get(url, config);
    console.log("API Response:", response.data); // Logge die API-Antwort
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Fehler beim Abrufen der Solar-Daten:', error);
    res.status(500).json({ message: 'Fehler beim Abrufen der Daten', error });
  }
}


// pages/api/solar.js
import axios from 'axios';
import getToken from '../../src/lib/getToken'; // Pfad anpassen, abhängig davon, wo deine Funktion gespeichert ist

export default async function handler(req, res) {
  const url = 'https://vrmapi.victronenergy.com/v2/installations/193415/stats?interval=15mins&type=live_feed';
  
  try {
    const accessToken = await getToken(); // Token aus der Datenbank holen
    const config = {
      headers: { 'x-authorization': `Bearer ${accessToken}` }
    };
    const response = await axios.get(url, config);
    console.log("API Response:", response.data); // Logge die API-Antwort
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Fehler beim Abrufen der Solar-Daten:', error);
    res.status(500).json({ message: 'Fehler beim Abrufen der Daten', error });
  }
}

*/

// pages/api/solar.js
import axios from 'axios';
import getToken from '../../src/lib/getToken';

export default async function handler(req, res) {
  // Standard-URL ohne Parameter
  let url = 'https://vrmapi.victronenergy.com/v2/installations/193415/stats?interval=15mins&type=live_feed';

  // Parameter aus der Anfrage abfragen
  const { interval, start, type } = req.query;

  // Falls Parameter vorhanden sind, URL entsprechend anpassen
  if (interval || start || type) {
    const params = new URLSearchParams({
      interval: interval || '15mins',
      type: type || 'live_feed',
      start: start || ''
    });

    url = `https://vrmapi.victronenergy.com/v2/installations/193415/stats?${params.toString()}`;
  }

  try {
    const accessToken = await getToken(); // Token aus der Datenbank holen
    const config = {
      headers: { 'x-authorization': `Bearer ${accessToken}` }
    };

    const response = await axios.get(url, config);
    console.log('API Response:', response.data); // Logge die API-Antwort
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Fehler beim Abrufen der Solar-Daten:', error);
    res.status(500).json({ message: 'Fehler beim Abrufen der Daten', error });
  }
}
