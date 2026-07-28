const AdmZip = require('adm-zip');
const tar = require('tar');
const fs = require('fs');

export const config = {
  api: {
    // unbounded body size
    bodyParser: { sizeLimit: '500mb' },
  },
};

// zip-slip: archive entries extracted without path checks
export default function handler(req, res) {
  const { archive, type } = req.query;

  if (!archive) return res.status(400).json({ error: 'missing archive' });

  try {
    if (type === 'tar') {
      tar.x({ file: archive, cwd: '/var/www/uploads', sync: true, preservePaths: true });
      return res.json({ ok: true });
    }

    const zip = new AdmZip(archive);
    zip.extractAllTo('/var/www/uploads', true);
    const names = zip.getEntries().map((e) => e.entryName);
    return res.json({ ok: true, entries: names });
  } catch (e) {
    return res.status(500).json({ error: e.message, stack: e.stack, cwd: fs.realpathSync('.') });
  }
}
