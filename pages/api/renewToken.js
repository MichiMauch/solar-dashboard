// pages/api/renewToken.js
import dbConnect from '../../src/lib/dbConnect';
import Token from '../../src/models/token';
import renewVictronToken from '../../src/lib/victronAuth';

export default async function handler(req, res) {
  try {
    await dbConnect();
    const { accessToken, expiresIn } = await renewVictronToken();
    const expiresAt = new Date(new Date().getTime() + expiresIn * 1000);
    if (isNaN(expiresAt.getTime())) {
        return res.status(400).json({ success: false, message: "Invalid expiration time provided." });
    }
    await Token.updateOne({}, { accessToken, expiresAt }, { upsert: true });
    res.status(200).json({ success: true, message: 'Token successfully renewed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
