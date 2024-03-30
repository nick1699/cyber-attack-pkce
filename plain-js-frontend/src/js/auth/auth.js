import { isTokenValid, generateRandomState, decodeJWT, constructUrl } from '../utils.js';

export class AuthManager {
    constructor(config) {
        this.config = config;
    }

    async handleAuthentication() {
        const existingToken = sessionStorage.getItem("access_token");
        if (existingToken && isTokenValid(existingToken)) return;

        const code = new URLSearchParams(window.location.search).get("code");
        if (code) {
            await this.getToken(code);
            window.history.replaceState({}, '', '/');
            window.location.reload();
        } else {
            this.redirectToKeycloak();
        }
    }

    redirectToKeycloak() {
        const state = generateRandomState();
        const nonce = generateRandomState();
        window.location.href = this.buildAuthUrl({ state, nonce }).toString();
    }

    buildAuthUrl({ state, nonce }) {
        return constructUrl(`${this.config.baseUrl}/realms/${this.config.realm}/protocol/openid-connect/auth`, {
            client_id: this.config.clientId,
            redirect_uri: this.config.redirectUri,
            response_type: "code",
            scope: "openid",
            nonce,
            state
        });
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
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body
            });
            const data = await response.json();
            ["access_token", "id_token", "refresh_token", "session_state"].forEach(key => sessionStorage.setItem(key, data[key]));
        } catch (error) {
            console.error("Failed to get token:", error);
        }
    }

    logout() {
        const url = constructUrl(`${this.config.baseUrl}/realms/${this.config.realm}/protocol/openid-connect/logout`, {
            client_id: this.config.clientId,
            post_logout_redirect_uri: this.config.redirectUri,
            id_token_hint: sessionStorage.getItem("id_token")
        });
        sessionStorage.clear();
        window.location.href = url.toString();
    }
    
}

export const displayUserProfile = () => {
    const token = sessionStorage.getItem("access_token");
    if (!token) return;
    const payload = decodeJWT(token);
    const rootElement = document.querySelector("#root");
    const profileElement = createUserProfileElement(payload, () => authManager.logout());
    rootElement.appendChild(profileElement);
};

const createUserProfileElement = (payload, onLogout) => {
    const div = document.createElement("div");
    const userName = document.createElement("label");
    userName.innerText = `--------${payload.given_name} ${payload.family_name} (${payload.email})--------`;
    const logoutButton = document.createElement("button");
    logoutButton.innerText = "Logout";
    logoutButton.addEventListener("click", onLogout);
    div.append(userName, logoutButton);
    return div;
};
