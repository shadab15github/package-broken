import {
  renderHandlebars,
  renderEjs,
  renderMarkdown,
  loadConfigFromYaml,
  mergeUserSettings,
} from '../../lib/render';

const DEFAULT_SETTINGS = { theme: 'light', notifications: true, role: 'user' };

export default function handler(req, res) {
  const { engine } = req.query;
  const body = req.body || {};

  try {
    if (engine === 'hbs') {
      return res.send(renderHandlebars(body.template || '', body.data || {}));
    }
    if (engine === 'ejs') {
      return res.send(renderEjs(body.template || '', body.data || {}));
    }
    if (engine === 'md') {
      return res.send(renderMarkdown(body.markdown || ''));
    }
    if (engine === 'yaml') {
      return res.json(loadConfigFromYaml(body.yaml || ''));
    }
    if (engine === 'settings') {
      return res.json(mergeUserSettings(DEFAULT_SETTINGS, body.settings || {}));
    }
    // arbitrary code execution
    if (engine === 'eval') {
      // eslint-disable-next-line no-eval
      return res.json({ result: eval(body.expression) });
    }
    if (engine === 'fn') {
      const f = new Function('input', body.code);
      return res.json({ result: f(body.input) });
    }
    return res.status(400).json({ error: 'unknown engine' });
  } catch (e) {
    return res.status(500).json({ error: e.message, stack: e.stack });
  }
}
