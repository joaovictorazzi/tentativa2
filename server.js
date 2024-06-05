const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

const dbPath = './db.json';

// Helper function to read the JSON file
const readDatabase = () => {
    return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
};

// Helper function to write to the JSON file
const writeDatabase = (data) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// Endpoint to get all users
app.get('/users', (req, res) => {
    const users = readDatabase();
    res.json(users);
});

// Endpoint to register a new user
app.post('/users', (req, res) => {
    const { username, password } = req.body;
    const users = readDatabase();

    if (users.some(user => user.username === username)) {
        return res.status(400).json({ message: 'Username already exists' });
    }

    users.push({ username, password });
    writeDatabase(users);

    res.status(201).json({ message: 'User registered successfully' });
});

// Endpoint to authenticate a user
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = readDatabase();

    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        res.status(200).json({ message: 'Login successful' });
    } else {
        res.status(400).json({ message: 'Invalid username or password' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

