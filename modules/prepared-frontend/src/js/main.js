import {AuthManager} from './auth/AuthManager.js';
import {displayUserProfile, displaySearchQuery} from "./ui/ui.js";
import {config} from './config/config.js';

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