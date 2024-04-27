const { auth } = require('express-openid-connect');
const express = require('express');
const ejs = require('ejs');
const path = require('path');

const config = {
    authRequired: false,
    baseURL: 'http://localhost:4201',
    clientID: 'fixed-application',
    clientSecret: 'X3WhVfbPbyoV5RShdefbGalu5hs1ZXrh',
    issuerBaseURL: 'http://localhost:8080/realms/cyber-attack',
    secret: 'e2UyOmghQvuSmXDq4EMXMcezzCZRVQ',
    authorizationParams: {
        response_type: 'code'
    },
    idpLogout: true,
    routes: {
        // Default Login Route abschalten, um eigene Parameter mitzugeben
        login: false
    }
};
const app = express();

const port = 4201;

// Setze die Template-Engine auf EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Auth-Router fügt die Routen /login, /logout und /callback zur Base-URL hinzu
app.use(auth(config));

app.get('/login', (req, res) =>
    res.oidc.login({
        returnTo: req.get('Referrer')
    })
);

app.get('/', async (req, res) => {
    if (req.oidc.isAuthenticated()) {
        let { token_type, access_token, isExpired, refresh } = req.oidc.accessToken;
        if (isExpired()) {
            ({ access_token } = await refresh());
        }

        const response = await fetch('http://localhost:3000/api/accounts', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            }
        });
        if (response.ok) {
            const data = await response.json();
            res.render('index', {
                city: req.query.city,
                isAuthenticated: req.oidc.isAuthenticated(),
                accounts: data,
                givenName: req.oidc.user ? req.oidc.user.given_name : null
            });
            return;
        } else {
            throw new Error('Failed to fetch accounts: ' + response.status.toString());
        }
    }

    res.render('index', {
        city: req.query.city,
        isAuthenticated: req.oidc.isAuthenticated(),
        accounts: null,
        givenName: req.oidc.user ? req.oidc.user.given_name : null
    });
});

app.listen(port, () => {
    console.log(`Server läuft unter http://localhost:${port}`);
});