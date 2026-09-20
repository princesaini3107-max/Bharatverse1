import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'bharatverse_demo_secret_change_me';

export function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role, name: user.name }, JWT_SECRET, {
    expiresIn: '7d',
  });
}

// Attaches req.user if a valid Bearer token is present; otherwise leaves it null.
export function optionalAuth(req, _res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (token) {
    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch {
      req.user = null;
    }
  }
  next();
}

// Requires a valid token.
export function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Sign in required.' });
  next();
}

// Requires a specific role (e.g. 'admin', 'vendor').
export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Sign in required.' });
    if (req.user.role !== role)
      return res.status(403).json({ error: `This action needs a ${role} account.` });
    next();
  };
}
