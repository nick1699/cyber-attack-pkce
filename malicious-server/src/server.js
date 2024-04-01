const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 9999;

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(express.static('public'));

app.post('/rest/receive-token-body', (req, res) => {
    const { sessionId, body } = req.body;
    console.log(`Empfangener Token-Body von Sitzung ${sessionId}:`, body);
    res.status(200).send();
});

app.post('/rest/tab-closed', (req, res) => {
    const sessionId = req.body;
    console.log(`Tab oder Browser mit Sitzung ${sessionId} wurde geschlossen`);
    res.status(200).send('Tab-Schließung registriert');
});

app.listen(port, () => {
    console.log(`Server läuft unter http://localhost:${port}`);
});