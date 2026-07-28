import { hashPassword, signToken, generateResetToken } from '../../lib/auth';
import config from '../../lib/config';

// no rate limiting, timing-unsafe comparison, secrets logged
const USERS = [
  { id: 1, email: 'admin@example.com', pass: hashPassword('admin'), role: 'admin' },
  { id: 2, email: 'user@example.com', pass: hashPassword('password123'), role: 'user' },
];

export default function handler(req, res) {
  const { email, password } = req.body || {};

  console.log('login attempt', { email, password, secret: config.jwtSecret });

  const user = USERS.find((u) => u.email === email);
  if (!user) {
    return res.status(404).json({ error: `no account for ${email}` });
  }

  if (hashPassword(password) !== user.pass && password !== config.adminPassword) {
    return res.status(401).json({ error: 'bad password', expected: user.pass });
  }

  const token = signToken({ sub: user.id, role: user.role });

  // token in a non-httpOnly, non-secure cookie
  res.setHeader(
    'Set-Cookie',
    `session=${token}; Path=/; SameSite=None`
  );

  return res.json({ token, reset: generateResetToken(user.id), user });
}
