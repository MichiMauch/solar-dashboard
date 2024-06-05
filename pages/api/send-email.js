import mandrill from 'mandrill-api/mandrill';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { getLastMonthSolarStats, getPeakDay, getAutarkieStats, getLastMonthGridUsage } from '../../src/utils/solarMonthlyHistory';

// Initialisieren des Mandrill-Clients mit dem API-Schlüssel aus den Umgebungsvariablen
const mandrillClient = new mandrill.Mandrill(process.env.MANDRILL);

// Funktion zur Formatierung des Datums
const formatDate = (date) => {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Intl.DateTimeFormat('de-DE', options).format(date);
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Abrufen der produzierten und verbrauchten kWh vom letzten Monat
    const { totalSolarYield, totalConsumption } = await getLastMonthSolarStats();

    // Abrufen des Tages mit dem höchsten Peak
    const peakDay = await getPeakDay();
    const peakDateString = peakDay.date ? formatDate(peakDay.date) : 'kein Datum gefunden';
    const peakPower = Math.ceil(peakDay.peak_power);

    // Abrufen der Autarkie-Werte
    const { autarkie, autarkieDifference } = await getAutarkieStats();
    const autarkieDiffString = autarkieDifference ? (autarkieDifference > 0 ? `+${autarkieDifference}` : autarkieDifference) : 'N/A';

    // Abrufen des extern bezogenen Stroms im letzten Monat
    const gridUsage = await getLastMonthGridUsage();

    // Funktion zur Formatierung des Monatsnamens
    const formatMonth = (date) => {
      const options = { month: 'long' };
      return new Intl.DateTimeFormat('de-DE', options).format(date);
    };

    const lastMonthDate = new Date();
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
    const lastMonthName = formatMonth(lastMonthDate);

    // Pfad zur Bildvorlage
    const imagePath = path.join(process.cwd(), 'public/template.webp');
    const templateBuffer = fs.readFileSync(imagePath);

    // SVG-Inhalte erstellen
    const svgWidth = 1792;
    const svgHeight = 1024;
    const fontSize = 40;
    const fillColor = 'black';

    const svgContent = `
      <svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg" style="background: url('template.webp'); background-size: cover;">
        <text x="510" y="440" font-size="${fontSize}" fill="${fillColor}" text-anchor="middle">
          <tspan x="900" dy="0">Produziert:</tspan>
          <tspan x="892" dy="1.2em">${totalSolarYield} kWh</tspan>
        </text>
        <text x="448" y="570" font-size="${fontSize}" fill="${fillColor}" text-anchor="middle">
          <tspan x="900" dy="0">Verbraucht:</tspan>
          <tspan x="893" dy="1.2em">${totalConsumption} kWh</tspan>
        </text>
        <text x="1216" y="580" font-size="${fontSize}" fill="${fillColor}" text-anchor="middle">
          <tspan x="1216" dy="0">Peak:</tspan>
          <tspan x="1216" dy="1.2em">${peakPower} W</tspan>
        </text>
        <text x="580" y="465" font-size="${fontSize}" fill="${fillColor}" text-anchor="middle">
          <tspan x="583" dy="0">Autarkie:</tspan>
          <tspan x="581" dy="1.2em">${autarkie}%</tspan>
        </text>
        <text x="580" y="580" font-size="${fontSize}" fill="${fillColor}" text-anchor="middle">
          <tspan x="583" dy="0">Vormonat:</tspan>
          <tspan x="581" dy="1.2em">${autarkieDiffString}%</tspan>
        </text>
        <text x="1216" y="465" font-size="36" fill="${fillColor}" text-anchor="middle">
          <tspan x="1216" dy="0">Extern:</tspan>
          <tspan x="1216" dy="1.2em">${gridUsage} kWh</tspan>
        </text>
      </svg>
    `;
    const svgBuffer = Buffer.from(svgContent);

    // Erstelle das Bild mit den Daten
    const image = sharp(templateBuffer)
      .composite([{ input: svgBuffer, gravity: 'north' }]);

    // Generiere das Bild und konvertiere es in eine Base64-URL
    const outputBuffer = await image.png().toBuffer();
    const base64Image = outputBuffer.toString('base64');
    const imageUrl = `data:image/png;base64,${base64Image}`;

    // Nachricht für die E-Mail
    const message = {
      "html": `
        <h1>KOKOMO Solar-Kennzahlen für den Monat ${lastMonthName}</h1>
        <p>Produzierter kWh: ${totalSolarYield} kWh.</p>
        <p>Verbrauchte kWh: ${totalConsumption} kWh.</p>
        <p>Höchster Lade-Peak der Batterie am ${peakDateString} mit ${peakPower} W.</p>
        <p>Autarkie des Jahres: ${autarkie}% (${autarkieDiffString}% gegenüber dem Vormonat).</p>
        <p>Extern bezogener Strom: ${gridUsage} kWh.</p>
      `,
      "subject": `KOKOMO Solar-Kennzahlen für den Monat ${lastMonthName}`,
      "from_email": "michi.mauch@gmail.com",
      "from_name": "Michi",
      "to": [
        { "email": "michi.mauch@gmail.com", "name": "Michi" },
        //{ "email": "skoelliker@gmail.com", "name": "Sibylle" }
      ],
      "attachments": [
        {
          "type": "image/png",
          "name": `KOKOMO-Solar-Kennzahlen-${lastMonthName}.png`,
          "content": base64Image
        }
      ],
      "important": false,
      "track_opens": true,
      "track_clicks": true
    };

    mandrillClient.messages.send({ "message": message, "async": false }, (result) => {
      console.log(result);
      res.status(200).json({ message: 'Email sent successfully', result });
    }, (error) => {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'Error sending email', error: error.message });
    });

  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ message: 'Error processing request', error: error.message });
  }
}
