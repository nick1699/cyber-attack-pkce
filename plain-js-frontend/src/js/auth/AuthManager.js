import {constructUrl} from '../utils/urlHelper.js';

export class AuthManager {
    constructor(config) {
        this.config = config;
    }

    async handleAuthentication() {
        const existingToken = sessionStorage.getItem("access_token");
        if (existingToken && this.isTokenValid(existingToken)) return;

        const code = new URLSearchParams(window.location.search).get("code");
        if (code) {
            await this.getToken(code);
            window.history.replaceState({}, '', '/');
            window.location.reload();
        } else {
            this.redirectToKeycloak();
        }
    }

    async getAccessTokenClaims() {
        const token = sessionStorage.getItem("access_token");
        if (!token || !this.isTokenValid(token)) return null;
        return this.decodeJWT(token); // Diese Methode gibt das decodierte Payload zurück
    }

    async getToken(code) {
        const url = constructUrl(`${this.config.baseUrl}/realms/${this.config.realm}/protocol/openid-connect/token`);
        const body = new URLSearchParams({
            client_id: this.config.clientId,
            redirect_uri: this.config.redirectUri,
            grant_type: "authorization_code",
            code
        });
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body
            });
            const data = await response.json();
            ["access_token", "id_token", "refresh_token", "session_state"].forEach(key => sessionStorage.setItem(key, data[key]));
        } catch (error) {
            console.error("Failed to get token:", error);
        }
    }

    buildAuthUrl({state, nonce}) {
        return constructUrl(`${this.config.baseUrl}/realms/${this.config.realm}/protocol/openid-connect/auth`, {
            client_id: this.config.clientId,
            redirect_uri: this.config.redirectUri,
            response_type: "code",
            scope: "openid",
            nonce,
            state
        });
    }

    decodeJWT = token => {
        const parts = token.split('.');
        if (parts.length !== 3) throw new Error('Invalid JWT');
        return JSON.parse(window.atob(parts[1]));
    };

    generateRandomState(length = 32) {
        let array = new Uint8Array(length);
        window.crypto.getRandomValues(array);
        return Array.from(array).map(b => b.toString(36).padStart(2, '0')).join('');
    }

    isTokenValid = (token) => {
        if (!token) return false;
        const payload = this.decodeJWT(token);
        const now = Date.now() / 1000;
        return payload.exp > now;
    };

    logout() {
        const url = constructUrl(`${this.config.baseUrl}/realms/${this.config.realm}/protocol/openid-connect/logout`, {
            client_id: this.config.clientId,
            post_logout_redirect_uri: this.config.redirectUri,
            id_token_hint: sessionStorage.getItem("id_token")
        });
        sessionStorage.clear();
        window.location.href = url.toString();
    }

    redirectToKeycloak() {
        const state = this.generateRandomState();
        const nonce = this.generateRandomState();
        window.location.href = this.buildAuthUrl({state, nonce}).toString();
    }
}
