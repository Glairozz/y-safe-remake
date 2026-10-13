const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'y-safe-secret-key-2026';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'your-password';
// On Vercel the project directory is read-only; only /tmp is writable.
const DATABASE_PATH = process.env.DATABASE_PATH || (process.env.VERCEL ? '/tmp/database.sqlite' : './database.sqlite');

const DIST_DIR = path.join(__dirname, 'client', 'dist');

app.use(cors());
app.use(bodyParser.json());

// Legacy .html routes -> clean SPA routes (backward compatibility)
const legacyRedirects = {
  '/index.html': '/',
  '/dashboard.html': '/dashboard',
  '/first-aid.html': '/first-aid',
  '/safety.html': '/safety',
  '/essentials.html': '/essentials',
  '/admin.html': '/admin',
  '/admin-login.html': '/admin-login',
};

for (const [from, to] of Object.entries(legacyRedirects)) {
  app.get(from, (req, res) => res.redirect(301, to));
}

app.use(express.static(DIST_DIR));

// ---------------------------------------------------------------------------
// Database
// ---------------------------------------------------------------------------

let dbReady = false;

const db = new sqlite3.Database(DATABASE_PATH, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    // Do not exit: on a serverless platform a crash is worse than a failed query.
    console.error('Database connection error:', err);
    console.error('Database path:', DATABASE_PATH);
    return;
  }
  console.log('Connected to SQLite database at:', DATABASE_PATH);
  db.run('PRAGMA foreign_keys = ON');
  db.run('PRAGMA journal_mode = WAL');
  initializeDatabase();
});

function initializeDatabase() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      section TEXT,
      is_guest INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS quiz_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      quiz_type TEXT NOT NULL,
      quiz_id TEXT NOT NULL,
      score INTEGER NOT NULL DEFAULT 0,
      total_questions INTEGER NOT NULL DEFAULT 0,
      completed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS lesson_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      lesson_id TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      completed_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE (user_id, lesson_id)
    )`);

    // Indexes for the queries the API and admin console actually run.
    db.run('CREATE INDEX IF NOT EXISTS idx_users_created_at ON users (created_at DESC)');
    db.run('CREATE INDEX IF NOT EXISTS idx_users_identity ON users (is_guest, name, section)');
    db.run('CREATE INDEX IF NOT EXISTS idx_quiz_progress_user ON quiz_progress (user_id)');
    db.run('CREATE INDEX IF NOT EXISTS idx_quiz_progress_type ON quiz_progress (quiz_type, completed_at DESC)');
    db.run('CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON lesson_progress (user_id)');

    db.run('SELECT 1', (err) => {
      if (err) {
        console.error('Database initialization error:', err);
      } else {
        dbReady = true;
      }
    });
  });
}

// Promise wrappers around the callback-based driver.
const run = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });

const get = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });

const all = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toClientUser(user) {
  return {
    id: user.id,
    name: user.name,
    section: user.section || undefined,
    isGuest: !!user.is_guest,
  };
}

function signUserToken(user) {
  return jwt.sign(
    { userId: user.id, name: user.name, isGuest: !!user.is_guest },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Find an existing user (so repeat logins do not create duplicate rows) or
// create one. Guests are persisted too, with is_guest = 1, so their activity
// shows up correctly in the admin console.
async function findOrCreateUser({ name, section, isGuest }) {
  const guestFlag = isGuest ? 1 : 0;
  const cleanName = (name && String(name).trim()) || (guestFlag ? 'Guest' : '');
  const cleanSection = section && String(section).trim() ? String(section).trim() : null;

  const existing = await get(
    `SELECT * FROM users
     WHERE is_guest = ? AND name = ? AND IFNULL(section, '') = IFNULL(?, '')
     LIMIT 1`,
    [guestFlag, cleanName, cleanSection]
  );
  if (existing) return existing;

  const result = await run(
    'INSERT INTO users (name, section, is_guest) VALUES (?, ?, ?)',
    [cleanName, cleanSection, guestFlag]
  );
  return {
    id: result.lastID,
    name: cleanName,
    section: cleanSection,
    is_guest: guestFlag,
    created_at: new Date().toISOString(),
  };
}

function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function handleError(res, context, err) {
  console.error(`${context} error:`, err);
  res.status(500).json({ error: 'Database error: ' + err.message });
}

// ---------------------------------------------------------------------------
// Auth API
// ---------------------------------------------------------------------------

async function registerOrLogin(req, res) {
  const { name, section, isGuest } = req.body || {};

  if (!isGuest && (!name || !String(name).trim())) {
    return res.status(400).json({ error: 'Name is required for registered users' });
  }

  try {
    const user = await findOrCreateUser({ name, section, isGuest });
    res.json({ token: signUserToken(user), user: toClientUser(user) });
  } catch (err) {
    handleError(res, 'Register/login', err);
  }
}

app.post('/api/register', registerOrLogin);
app.post('/api/login', registerOrLogin);

app.get('/api/user', requireAuth, async (req, res) => {
  try {
    if (req.user.userId != null) {
      const user = await get('SELECT * FROM users WHERE id = ?', [req.user.userId]);
      if (user) return res.json({ user: toClientUser(user) });
    }
    res.json({ user: { id: req.user.userId ?? null, name: req.user.name, isGuest: !!req.user.isGuest } });
  } catch (err) {
    handleError(res, 'Get user', err);
  }
});

// ---------------------------------------------------------------------------
// Progress API (persisted per user)
// ---------------------------------------------------------------------------

app.post('/api/quiz-progress', requireAuth, async (req, res) => {
  const { quizType, quizId, score, totalQuestions } = req.body || {};
  if (!quizType || !quizId) {
    return res.status(400).json({ error: 'quizType and quizId are required' });
  }
  try {
    await run(
      `INSERT INTO quiz_progress (user_id, quiz_type, quiz_id, score, total_questions)
       VALUES (?, ?, ?, ?, ?)`,
      [req.user.userId, quizType, quizId, Number(score) || 0, Number(totalQuestions) || 0]
    );
    res.json({ success: true });
  } catch (err) {
    handleError(res, 'Save quiz progress', err);
  }
});

app.get('/api/quiz-progress/:quizType', requireAuth, async (req, res) => {
  try {
    const progress = await all(
      `SELECT id, quiz_type, quiz_id, score, total_questions, completed_at
       FROM quiz_progress
       WHERE user_id = ? AND quiz_type = ?
       ORDER BY completed_at DESC`,
      [req.user.userId, req.params.quizType]
    );
    res.json({ progress });
  } catch (err) {
    handleError(res, 'Get quiz progress', err);
  }
});

app.post('/api/lesson-progress', requireAuth, async (req, res) => {
  const { lessonId, completed = true } = req.body || {};
  if (!lessonId) {
    return res.status(400).json({ error: 'lessonId is required' });
  }
  try {
    await run(
      `INSERT INTO lesson_progress (user_id, lesson_id, completed, completed_at)
       VALUES (?, ?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id, lesson_id)
       DO UPDATE SET completed = excluded.completed, completed_at = excluded.completed_at`,
      [req.user.userId, lessonId, completed ? 1 : 0]
    );
    res.json({ success: true });
  } catch (err) {
    handleError(res, 'Save lesson progress', err);
  }
});

app.get('/api/lesson-progress', requireAuth, async (req, res) => {
  try {
    const progress = await all(
      `SELECT id, lesson_id, completed, completed_at
       FROM lesson_progress
       WHERE user_id = ?
       ORDER BY completed_at DESC`,
      [req.user.userId]
    );
    res.json({ progress });
  } catch (err) {
    handleError(res, 'Get lesson progress', err);
  }
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', database: dbReady ? 'ready' : 'connecting', timestamp: new Date().toISOString() });
});

// ---------------------------------------------------------------------------
// Admin API
// ---------------------------------------------------------------------------

function adminAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded.isAdmin) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    req.admin = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body || {};

  if (password === ADMIN_PASSWORD) {
    const token = jwt.sign({ isAdmin: true, name: 'Admin' }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, message: 'Login successful' });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

app.get('/api/admin/users', adminAuth, async (req, res) => {
  try {
    const users = await all('SELECT * FROM users ORDER BY created_at DESC');
    res.json({ users });
  } catch (err) {
    handleError(res, 'Admin users', err);
  }
});

app.get('/api/admin/quizzes', adminAuth, async (req, res) => {
  try {
    const quizzes = await all(
      `SELECT qp.*, COALESCE(u.name, 'Guest') AS user_name, u.section
       FROM quiz_progress qp
       LEFT JOIN users u ON qp.user_id = u.id
       ORDER BY qp.completed_at DESC`
    );
    res.json({ quizzes });
  } catch (err) {
    handleError(res, 'Admin quizzes', err);
  }
});

app.get('/api/admin/lessons', adminAuth, async (req, res) => {
  try {
    const lessons = await all(
      `SELECT lp.*, COALESCE(u.name, 'Guest') AS user_name, u.section
       FROM lesson_progress lp
       LEFT JOIN users u ON lp.user_id = u.id
       ORDER BY lp.completed_at DESC`
    );
    res.json({ lessons });
  } catch (err) {
    handleError(res, 'Admin lessons', err);
  }
});

app.get('/api/admin/user/:id', adminAuth, async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await get('SELECT * FROM users WHERE id = ?', [userId]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const [quizzes, lessons] = await Promise.all([
      all('SELECT * FROM quiz_progress WHERE user_id = ? ORDER BY completed_at DESC', [userId]),
      all('SELECT * FROM lesson_progress WHERE user_id = ? ORDER BY completed_at DESC', [userId]),
    ]);
    res.json({ user, quizzes, lessons });
  } catch (err) {
    handleError(res, 'Admin user detail', err);
  }
});

app.get('/api/admin/stats', adminAuth, async (req, res) => {
  try {
    const [usersResult, quizzesResult, lessonsResult, scoreResult] = await Promise.all([
      get('SELECT COUNT(*) AS count FROM users'),
      get('SELECT COUNT(*) AS count FROM quiz_progress'),
      get('SELECT COUNT(*) AS count FROM lesson_progress'),
      get('SELECT AVG(CAST(score AS FLOAT) / NULLIF(total_questions, 0)) * 100 AS avg FROM quiz_progress'),
    ]);

    res.json({
      totalUsers: usersResult.count,
      totalQuizzes: quizzesResult.count,
      totalLessons: lessonsResult.count,
      averageScore: scoreResult.avg ? Math.round(scoreResult.avg) : 0,
    });
  } catch (err) {
    handleError(res, 'Admin stats', err);
  }
});

// SPA fallback: serve index.html for any non-API GET route
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/') || req.path === '/health') return next();
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

// Start a standalone server only when run directly (e.g. `npm start`).
// When imported by a serverless platform (Vercel), the app is exported instead.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Y-SAFE Web server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
