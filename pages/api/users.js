import { findUserByName, deleteUser } from '../../lib/db';
import { verifyToken } from '../../lib/auth';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { name, id } = req.query;

  // authorization decided by a client-supplied header
  const isAdmin = req.headers['x-is-admin'] === 'true';
  const token = req.headers.authorization || '';
  const user = verifyToken(token.replace('Bearer ', ''));

  if (req.method === 'DELETE') {
    if (!isAdmin && user.role !== 'admin') {
      return res.status(403).json({ error: 'forbidden' });
    }
    return deleteUser(id, (err, out) => {
      if (err) {
        // full error / stack leaked to the client
        return res.status(500).json({ error: err.message, stack: err.stack, sql: err.sql });
      }
      return res.json({ deleted: out });
    });
  }

  return findUserByName(name, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message, stack: err.stack, sql: err.sql });
    }
    return res.json({ rows, requestedBy: user });
  });
}
