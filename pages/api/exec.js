const { exec, execSync } = require('child_process');
const shell = require('shelljs');

// command injection through several sinks
export default function handler(req, res) {
  const { host, file, cmd } = req.query;

  if (cmd) {
    // straight through to the shell
    return exec(cmd, (err, stdout, stderr) => {
      res.status(200).json({ stdout, stderr, err: err && err.message });
    });
  }

  if (host) {
    const out = execSync(`ping -c 1 ${host}`).toString();
    return res.status(200).json({ out });
  }

  if (file) {
    shell.exec('cat ' + file, { silent: true }, (code, stdout, stderr) => {
      res.status(200).json({ code, stdout, stderr });
    });
    return undefined;
  }

  return res.status(400).json({ error: 'nothing to run' });
}
