import {AuthManager} from './auth/AuthManager.js';
import {displayLoggedInContent, displayCityQuery} from "./ui/ui.js";
import {config} from './config/config.js';

const authManager = new AuthManager(config);

window.addEventListener("load", () => {
    if (authManager.hasAuthenticationCode()) {
        authManager.handleAuthentication().catch(error => {
            console.error("Fehler bei der Authentifizierung:", error);
        });
    } else if (authManager.isLoggedIn()) {
        authManager.setupAutomaticTokenRefresh();

        displayLoggedInContent(authManager).catch(error => {
            console.error("Fehler beim Anzeigen des Benutzerprofils:", error);
        });
    }

    displayCityQuery();
});


document.getElementById("login-button").addEventListener("click", () => {
    authManager.handleAuthentication().catch(error => {
        console.error("Fehler bei der Authentifizierung:", error);
    });
});