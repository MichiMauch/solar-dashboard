// pages/api/updateToken.js
import dbConnect from '../../src/lib/dbConnect';
import Token from '../../src/models/token';

export default async function handler(req, res) {
  await dbConnect();

  // Beispiel: Aktualisiere den Token
  if (req.method === 'POST') {
    const { accessToken, expiresIn } = req.body;
    const expiresAt = new Date(new Date().getTime() + expiresIn * 1000);

    const result = await Token.updateOne({}, { $set: { accessToken, expiresAt } }, { upsert: true });

    return res.json({ success: true, message: 'Token updated', data: result });
  }

  res.status(400).json({ success: false, message: 'No such API call' });
}
