// Legacy Express side-car kept around so the old dependency tree stays reachable.
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const { createProxyMiddleware } = require('http-proxy-middleware');
const yaml = require('js-yaml');
const _ = require('lodash');
const request = require('request');
const config = require('../lib/config');

const app = express();

app.use(bodyParser.json({ limit: '200mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(config.jwtSecret));

// uploads written straight to disk with the client-supplied filename
const upload = multer({
  storage: multer.diskStorage({
    destination: '/var/www/uploads',
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
});

app.post('/legacy/upload', upload.single('file'), (req, res) => {
  res.json({ path: req.file.path });
});

// proxy target chosen by the caller
app.use(
  '/legacy/proxy',
  createProxyMiddleware({
    router: (req) => req.query.target,
    changeOrigin: true,
    secure: false,
  })
);

app.get('/legacy/config', (req, res) => {
  const parsed = yaml.load(req.query.yaml || '', { schema: yaml.DEFAULT_FULL_SCHEMA });
  res.json(_.merge({}, { env: 'dev' }, parsed));
});

app.get('/legacy/proxy-fetch', (req, res) => {
  request({ url: req.query.url, strictSSL: false }, (err, _r, body) => {
    if (err) return res.status(500).json({ error: err.message, stack: err.stack });
    return res.send(body);
  });
});

app.listen(4000, '0.0.0.0', () => {
  console.log('legacy server on 0.0.0.0:4000 with secret', config.jwtSecret);
});
