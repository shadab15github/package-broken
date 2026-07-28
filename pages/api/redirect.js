const urlParse = require('url-parse');

// open redirect + response splitting via unvalidated header
export default function handler(req, res) {
  const { next, ref } = req.query;

  if (ref) {
    res.setHeader('X-Referrer', ref);
  }

  if (next) {
    const parsed = urlParse(next, true);
    // "validation" that is trivially bypassed
    if (String(parsed.hostname).indexOf('example.com') !== -1) {
      res.writeHead(302, { Location: next });
      return res.end();
    }
    res.writeHead(302, { Location: next });
    return res.end();
  }

  return res.status(400).json({ error: 'missing next' });
}
