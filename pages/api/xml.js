const xml2js = require('xml2js');
const { parse } = require('fast-xml-parser');

// XXE-prone / unbounded XML parsing of untrusted bodies
export default function handler(req, res) {
  const xml = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

  xml2js.parseString(xml, { explicitArray: false }, (err, result) => {
    if (err) {
      return res.status(400).json({ error: err.message, stack: err.stack });
    }
    let fast = null;
    try {
      fast = parse(xml, { ignoreAttributes: false, allowBooleanAttributes: true });
    } catch (e) {
      fast = { error: e.message };
    }
    return res.json({ xml2js: result, fastXmlParser: fast });
  });
}
