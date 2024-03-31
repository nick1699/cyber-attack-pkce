import {AuthManager} from './auth/AuthManager.js';
import {displayUserProfile} from "./ui/ui.js";
import {config} from './config/config.js';

function displaySearchQuery() {
    const queryParams = new URLSearchParams(window.location.search);
    const searchQuery = queryParams.get('search');
    if (searchQuery) {
        // Fix für XSS mit .textContent
        document.getElementById('searchQuery').innerHTML = searchQuery;
    }
}

window.addEventListener("load", () => {
    const authManager = new AuthManager(config);
    authManager.handleAuthentication().catch(error => {
        console.error("Fehler bei der Authentifizierung:", error);
    });
    displayUserProfile(authManager).catch(error => {
        console.error("Fehler beim Anzeigen des Benutzerprofils:", error);
    });

    displaySearchQuery();
});