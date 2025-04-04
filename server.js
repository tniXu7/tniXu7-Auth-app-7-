const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const path = require('path');
const { getCachedData } = require('./cache');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        sameSite: 'lax'
    }
}));

// In-memory user storage
const users = {};

// ROUTES

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/register', async (req, res) => {
    const { login, password } = req.body;
    if (users[login]) return res.status(400).send('User exists');
    users[login] = await bcrypt.hash(password, 10);
    res.redirect('/');
});

app.post('/login', async (req, res) => {
    const { login, password } = req.body;
    const user = users[login];
    if (!user || !(await bcrypt.compare(password, user))) {
        return res.status(401).send('Invalid credentials');
    }
    req.session.user = login;
    res.redirect('/profile.html');
});

app.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

app.get('/profile', (req, res) => {
    if (!req.session.user) return res.redirect('/');
    res.sendFile(path.join(__dirname, 'public/profile.html'));
});

app.get('/data', (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: 'Unauthorized' });
    const data = getCachedData();
    res.json({ data });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
