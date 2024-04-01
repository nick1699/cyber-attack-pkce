const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 9999;

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/rest/receive-token-body', (req, res) => {
    console.log("Empfangener Token-Body:", req.body);
    res.status(200).send();
});

app.post('/rest/tab-closed', (req, res) => {
    console.log("Tab oder Browser wurde geschlossen");
});

app.listen(port, () => {
    console.log(`Server läuft unter http://localhost:${port}`);
});