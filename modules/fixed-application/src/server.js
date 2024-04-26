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
    // afterCallback: (req, res, session, decodedState) => {
    //     console.log(req);
    //     console.log(res);
    //     console.log(session);
    //     console.log(decodedState);
    // }
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

app.get('/', (req, res) => {
    res.render('index', {
        city: req.query.city,
        isAuthenticated: req.oidc.isAuthenticated(),
        givenName: req.oidc.user ? req.oidc.user.given_name : null
    });
});

app.listen(port, () => {
    console.log(`Server läuft unter http://localhost:${port}`);
});