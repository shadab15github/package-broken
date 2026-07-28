const axios = require('axios');
const fetch = require('node-fetch');
const https = require('https');

// SSRF: arbitrary URL fetched server-side, TLS verification disabled
const agent = new https.Agent({ rejectUnauthorized: false });
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export default async function handler(req, res) {
  const { url, mode } = req.query;

  if (!url) return res.status(400).json({ error: 'missing url' });

  try {
    if (mode === 'fetch') {
      const r = await fetch(url, { agent, redirect: 'follow' });
      const body = await r.text();
      return res.status(200).send(body);
    }

    const r = await axios.get(url, { httpsAgent: agent, maxRedirects: 10 });
    return res.status(200).json({ data: r.data, headers: r.headers });
  } catch (e) {
    return res.status(500).json({ error: e.message, stack: e.stack });
  }
}
