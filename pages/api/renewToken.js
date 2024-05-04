// pages/api/renewToken.js
import dbConnect from '../../src/lib/dbConnect';
import Token from '../../src/models/token';
import renewVictronToken from '../../src/lib/victronAuth';

export default async function handler(req, res) {
  console.log(`Start Token Renewal: ${new Date().toISOString()}`);
  try {
    await dbConnect();
    console.log(`Database connected: ${new Date().toISOString()}`);

    const { accessToken, expiresIn } = await renewVictronToken();
    console.log(`Token received: ${new Date().toISOString()}`);

    const expiresAt = new Date(new Date().getTime() + expiresIn * 1000);
    if (isNaN(expiresAt.getTime())) {
        console.log(`Invalid expiration time: ${new Date().toISOString()}`);
        return res.status(400).json({ success: false, message: "Invalid expiration time provided." });
    }

    await Token.updateOne({}, { accessToken, expiresAt }, { upsert: true });
    console.log(`Token stored in database: ${new Date().toISOString()}`);
    
    res.status(200).json({ success: true, message: 'Token successfully renewed' });
  } catch (error) {
    console.error(`Error during token renewal: ${new Date().toISOString()}`, error);
    res.status(500).json({ success: false, message: error.message });
  }
}

