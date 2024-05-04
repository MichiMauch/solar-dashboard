// src/models/token.js
import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
  accessToken: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  }
});

const Token = mongoose.models.Token || mongoose.model('Token', tokenSchema);

export default Token;
