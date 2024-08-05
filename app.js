const express = require('express');
const fs = require('fs');

const app = express();

const authHeader = 'VONEZ-TOKEN';
const authToken = 'TANGINAMO-BOBO-KABA-HA';

const authMiddleware = (req, res, next) => {
    const token = req.header(authHeader);
    if (!token || token !== authToken) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    next();
};

app.get('/random-key', authMiddleware, (req, res) => {
    fs.readFile('keys.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        const lines = data.split('\n');

        const validLines = lines.filter(line => line.trim() !== '');

        if (validLines.length === 0) {
            res.status(404).json({ error: 'No keys found' });
            return;
        }

        const randomIndex = Math.floor(Math.random() * validLines.length);
        const selectedLine = validLines[randomIndex];

        const key = selectedLine.split(',')[0].split(':')[1].trim();

        res.json({ key });
    });
});

const port = 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
