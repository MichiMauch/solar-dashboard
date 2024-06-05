import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export default async function handler(req, res) {
  // Beispielwerte für die Platzhalter
  const data = {
    totalSolarYield: 138,
    totalConsumption: 99,
    peakPower: 3000,
    autarkie: 85.5,
    gridUsage: 200,
    lastMonthChange: 5.5
  };

  try {
    const imagePath = path.join(process.cwd(), 'public/template.webp'); // Pfad zur Bildvorlage

    // Lade die Bildvorlage
    const templateBuffer = fs.readFileSync(imagePath);

    // SVG-Inhalte erstellen und zentrieren
    const svgWidth = 1792;  // Breite der SVG entsprechend dem Bild
    const svgHeight = 1024; // Höhe der SVG entsprechend dem Bild
    const fontSize = 36;    // Schriftgröße
    const fillColor = 'black';

    const svgContent = `
      <svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg" style="background: url('template.webp'); background-size: cover;">
        <text x="510" y="440" font-size="${fontSize}" fill="${fillColor}" text-anchor="middle">
          <tspan x="900" dy="0">Produziert:</tspan>
          <tspan x="892" dy="1.2em">${data.totalSolarYield} kWh</tspan>
        </text>
        <text x="448" y="570" font-size="${fontSize}" fill="${fillColor}" text-anchor="middle">
          <tspan x="900" dy="0">Verbraucht:</tspan>
          <tspan x="893" dy="1.2em">${data.totalConsumption} kWh</tspan>
        </text>
        <text x="1216" y="580" font-size="${fontSize}" fill="${fillColor}" text-anchor="middle">
          <tspan x="1216" dy="0">Peak:</tspan>
          <tspan x="1216" dy="1.2em">${data.peakPower} W</tspan>
        </text>
        <text x="580" y="465" font-size="${fontSize}" fill="${fillColor}" text-anchor="middle">
          <tspan x="583" dy="0">Autarkie:</tspan>
          <tspan x="581" dy="1.2em">${data.autarkie}%</tspan>
        </text>
        <text x="580" y="580" font-size="${fontSize}" fill="${fillColor}" text-anchor="middle">
          <tspan x="583" dy="0">Vormonat:</tspan>
          <tspan x="581" dy="1.2em">${data.lastMonthChange >= 0 ? '+' : ''}${data.lastMonthChange}%</tspan>
        </text>
        <text x="1216" y="465" font-size="36" fill="${fillColor}" text-anchor="middle">
          <tspan x="1216" dy="0">Extern:</tspan>
          <tspan x="1216" dy="1.2em">${data.gridUsage} kWh</tspan>
        </text>
      </svg>
    `;
    const svgBuffer = Buffer.from(svgContent);

    const image = sharp(templateBuffer)
      .composite([{ input: svgBuffer, gravity: 'north' }]);

    // Generiere das Bild und sende es als Antwort
    const outputBuffer = await image.webp().toBuffer();
    res.setHeader('Content-Type', 'image/webp');
    res.send(outputBuffer);
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).send('Error generating image');
  }
}
