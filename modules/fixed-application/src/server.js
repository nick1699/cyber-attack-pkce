const { auth } = require('express-openid-connect');
const express = require('express');
const ejs = require('ejs');
const path = require('path');

const config = {
    authRequired: false,
    baseURL: 'http://localhost:3000',
    clientID: 'fixed-application',
    clientSecret: 'X3WhVfbPbyoV5RShdefbGalu5hs1ZXrh',
    issuerBaseURL: 'http://localhost:8080/realms/cyber-attack',
    secret: 'e2UyOmghQvuSmXDq4EMXMcezzCZRVQ',
    authorizationParams: {
        response_type: 'code'
    },
    idpLogout: true
};
const app = express();

const port = 3000;

// Setze die Template-Engine auf EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Auth-Router fügt die Routen /login, /logout und /callback zur Base-URL hinzu
app.use(auth(config));

app.get('/', (req, res) => {
    res.render('index', { isAuthenticated: req.oidc.isAuthenticated(), givenName: req.oidc.user ? req.oidc.user.given_name : null });
});

app.listen(port, () => {
    console.log(`Server läuft unter http://localhost:${port}`);
});