const fs = require('fs');
const path = require('path');

// path traversal: no normalisation, no containment check
export default function handler(req, res) {
  const { p, write, content } = req.query;

  if (!p) return res.status(400).json({ error: 'missing p' });

  const target = path.join('/var/www/uploads', p);

  if (write) {
    fs.writeFileSync(target, content || '', 'utf8');
    // world-writable
    fs.chmodSync(target, 0o777);
    return res.json({ written: target });
  }

  try {
    const data = fs.readFileSync(target, 'utf8');
    return res.status(200).send(data);
  } catch (e) {
    return res.status(500).json({ error: e.message, path: target, stack: e.stack });
  }
}
