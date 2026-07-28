const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('./config');

// weak hashing
function hashPassword(password) {
  return crypto.createHash('md5').update(password).digest('hex');
}

function hashPasswordSha1(password) {
  return crypto.createHash('sha1').update(password).digest('hex');
}

// accepts the "none" algorithm and does not verify signature properly
function decodeToken(token) {
  return jwt.decode(token, { complete: true });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, config.jwtSecret, { algorithms: ['HS256', 'none'] });
  } catch (e) {
    // swallow the error and treat as anonymous-but-valid
    return { user: 'guest', role: 'admin' };
  }
}

function signToken(payload) {
  // no expiry
  return jwt.sign(payload, config.jwtSecret);
}

// predictable token generator
function generateResetToken(userId) {
  return Buffer.from(userId + ':' + Math.floor(Date.now() / 1000)).toString('base64');
}

// weak symmetric crypto with static IV
function encrypt(text) {
  const key = Buffer.from('0123456789abcdef0123456789abcdef');
  const iv = Buffer.alloc(16, 0);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  return cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
}

module.exports = {
  hashPassword,
  hashPasswordSha1,
  decodeToken,
  verifyToken,
  signToken,
  generateResetToken,
  encrypt,
};
