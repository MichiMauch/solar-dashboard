const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/api', createProxyMiddleware({
  target: 'https://vrmapi.victronenergy.com', // Die URL Ihrer API
  changeOrigin: true,
  pathRewrite: { '^/api': '' }, // Entfernt /api aus dem Pfad
  logLevel: 'debug' // Zeigt detaillierte Informationen im Terminal
}));

app.listen(3001, () => {
  console.log('Proxy listening on port 3001'); // Der Port, auf dem der Proxy lauscht
});
