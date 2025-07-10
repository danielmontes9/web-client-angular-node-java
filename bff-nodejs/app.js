require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const TARGET_A = process.env.TARGET_BACKEND_A;
const TARGET_B = process.env.TARGET_BACKEND_B;

if (!TARGET_A && !TARGET_B) {
  console.error("TARGET_BACKEND is not defined in .env");
  process.exit(1);
}

app.use(logger('dev'));
// app.use(express.json());

function proxy(path) {
  return createProxyMiddleware({
    target: TARGET_A,
    changeOrigin: true,
    // pathRewrite: (pathReq) => pathReq.replace(/^\/(auth|resource)/, '/$1'),
    pathRewrite: (pathReq) => pathReq.replace(/\/(A|B)$/, ''),
    router: (req, res) => {
      const microserviceName = req.params.microservice;
      if (microserviceName === 'A') {
        return TARGET_A;
      } else if (microserviceName === 'B') {
        return TARGET_B;
      } else {
        console.error(`Unknown microservice: ${microserviceName}`);
      }
    },
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
app.post('/auth/login/:microservice', proxy('/auth/login'));
app.post('/auth/refresh/:microservice', proxy('/auth/refresh'));
app.get('/resource/:microservice', proxy('/resource'));

// Fallback 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

module.exports = app;
