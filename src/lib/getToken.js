// src/lib/getToken.js

import dbConnect from './dbConnect';
import Token from '../models/token';

async function getToken() {
  try {
    await dbConnect();
    const tokenDoc = await Token.findOne();
    if (!tokenDoc) {
      throw new Error('No token found');
    }
    return tokenDoc.accessToken;
  } catch (error) {
    console.error('Error retrieving token:', error);
    throw error;
  }
}

export default getToken;
