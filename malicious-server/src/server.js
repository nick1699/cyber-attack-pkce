const express = require('express');
const app = express();
const port = 9999;

app.use(express.static('public'));

app.get('/rest/receive-token', (req, res) => {
    console.log("Hat funktioniert");
    res.status(200).send('Daten empfangen');
});

app.listen(port, () => {
    console.log(`Server läuft unter http://localhost:${port}`);
});