import {isTokenValid, generateRandomState, decodeJWT} from './utils.js';
import {config} from './config.js';

const handleAuthentication = async () => {
    const existingToken = sessionStorage.getItem("access_token");
    if (existingToken && isTokenValid(existingToken)) {
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
        await getToken(code);
        window.history.replaceState({}, '', '/');
        window.location.reload();
        return;
    }
    redirectToKeycloak();
};

const redirectToKeycloak = () => {
    const state = generateRandomState();
    const nonce = generateRandomState();
    const connectionURI = buildAuthUrl(config, {state, nonce});
    window.location.href = connectionURI.toString();
};

const buildAuthUrl = ({baseUrl, realm, clientId, redirectUri}, {state, nonce}) => {
    const url = new URL(`${baseUrl}/realms/${realm}/protocol/openid-connect/auth`);
    const params = {
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: "openid",
        nonce,
        state
    };
    Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));
    return url;
};

const getToken = async code => {
    const url = new URL(`${config.baseUrl}/realms/${config.realm}/protocol/openid-connect/token`);
    const body = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        grant_type: "authorization_code",
        code
    });
    const response = await fetch(url, {
        method: 'post',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body
    });
    const data = await response.json();
    ["access_token", "id_token", "refresh_token", "session_state"].forEach(key => sessionStorage.setItem(key, data[key]));
};

const logout = () => {
    const url = new URL(`${config.baseUrl}/realms/${config.realm}/protocol/openid-connect/logout`);
    const idTokenHint = sessionStorage.getItem("id_token");
    const params = {
        client_id: config.clientId,
        post_logout_redirect_uri: config.redirectUri,
        id_token_hint: idTokenHint
    };
    Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));
    sessionStorage.clear();
    window.location.href = url.toString();
};

const displayUserProfile = () => {
    const token = sessionStorage.getItem("access_token");
    if (!token) return;
    const payload = decodeJWT(token);
    const rootElement = document.querySelector("#root");
    const profileElement = createUserProfileElement(payload, logout);
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

window.addEventListener("load", () => {
    handleAuthentication();
    displayUserProfile();
});