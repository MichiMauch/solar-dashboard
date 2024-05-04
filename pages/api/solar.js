// pages/api/solar.js
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
