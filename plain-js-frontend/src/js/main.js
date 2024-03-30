import { AuthManager, displayUserProfile } from './auth/auth.js';
import {config} from './config/config.js';

window.addEventListener("load", () => {
    const authManager = new AuthManager(config);
    authManager.handleAuthentication();
    displayUserProfile();
});