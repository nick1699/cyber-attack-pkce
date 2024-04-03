const { auth } = require('express-openid-connect');
const express = require('express');

const config = {
    authRequired: false,
    baseURL: 'http://localhost:3000',
    clientID: 'fixed-application',
    clientSecret: 'X3WhVfbPbyoV5RShdefbGalu5hs1ZXrh',
    issuerBaseURL: 'http://localhost:8080/realms/cyber-attack',
    secret: 'e2UyOmghQvuSmXDq4EMXMcezzCZRVQ',
    authorizationParams: {
        response_type: 'code'
    }
};
const app = express();

const port = 3000;

// Auth-Router fügt doe Rputen /login, /logout und /callback zur Base-URL hinzu
app.use(auth(config));

app.get('/', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out')
});

app.listen(port, () => {
    console.log(`Server läuft unter http://localhost:${port}`);
});