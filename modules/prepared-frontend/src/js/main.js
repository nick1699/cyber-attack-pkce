import {AuthManager} from './auth/AuthManager.js';
import {displayUserProfile, displayCityQuery} from "./ui/ui.js";
import {config} from './config/config.js';

const authManager = new AuthManager(config);

window.addEventListener("load", () => {
    const existingToken = sessionStorage.getItem("access_token");

    if (authManager.hasAuthenticationCode()) {
        authManager.handleAuthentication().catch(error => {
            console.error("Fehler bei der Authentifizierung:", error);
        });
    } else if (existingToken && authManager.isTokenValid(existingToken)) {
        authManager.setupAutomaticTokenRefresh();

        displayUserProfile(authManager).catch(error => {
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