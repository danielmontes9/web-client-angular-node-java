require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const TARGET = process.env.TARGET_BACKEND;

if (!TARGET) {
  console.error("TARGET_BACKEND is not defined in .env");
  process.exit(1);
}

app.use(logger('dev'));
// app.use(express.json());

function proxy(path) {
  return createProxyMiddleware({
    target: TARGET,
    changeOrigin: true,
    pathRewrite: (pathReq) => pathReq.replace(/^\/(auth|resource)/, '/$1'),
    onProxyReq: (proxyReq, req) => {
      if (req.body && Object.keys(req.body).length) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
        proxyReq.end();
      }
    },
    onError(err, req, res) {
      console.error('Proxy error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: "Proxy error", message: err.message });
      }
    },
  });
}

// Routes
app.post('/auth/login', proxy('/auth/login'));
app.post('/auth/refresh', proxy('/auth/refresh'));
app.get('/resource', proxy('/resource'));

// Fallback 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

module.exports = app;
