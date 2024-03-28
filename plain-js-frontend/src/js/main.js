const baseUrl = "http://localhost:8080";
const realm = "cyber-attack";
const client_id = "prepared-frontend";
const redirect_uri = `${location.protocol}//${location.host}/`;

const generateRandomState=()=> {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

const redirectToKeycloak = () => {
    const state = generateRandomState();
    const nonce = generateRandomState();
    const urlParams = {
        client_id,
        redirect_uri,
        response_type: "code",
        scope: "openid",
        nonce,
        state,
    };
    const connectionURI = new URL(`${baseUrl}/realms/${realm}/protocol/openid-connect/auth`);
    for(const key of Object.keys(urlParams)){
        connectionURI.searchParams.append(key, urlParams[key]);
    }
    window.location.href = connectionURI;
}

const getToken = async (code) => {
    const tokenUri = new URL(`${baseUrl}/realms/${realm}/protocol/openid-connect/token`);
    let body = new URLSearchParams();
    body.append("client_id", client_id);
    body.append("redirect_uri", redirect_uri);
    body.append("grant_type", "authorization_code");
    body.append("code", code);
    const data = await fetch(tokenUri, {
        method: 'post',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body,
    });
    const jsonData = await data.json();
    sessionStorage.setItem("token", jsonData.access_token);
    sessionStorage.setItem("id_token", jsonData.id_token);
    sessionStorage.setItem("refresh_token", jsonData.refresh_token);
    sessionStorage.setItem("session_state", jsonData.session_state);
    history.replaceState({}, '', '/');
    location.reload();
}

const decodeJWT = (token) => {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid JWT');
    const decoded = atob(parts[1]);
    return JSON.parse(decoded);
}

const generateUserProfile = () => {
    const JWT = sessionStorage.getItem("token");
    const payload = decodeJWT(JWT);
    console.log(payload);
    const div = document.createElement("div");
    const userName =  document.createElement("label");
    userName.innerText = `--------${payload.given_name} ${payload.family_name} (${payload.email})--------`;
    const logoutButton = document.createElement("button");
    logoutButton.innerText = "Logout";
    logoutButton.addEventListener("click", ()=>{
        logout();
    });
    div.appendChild(userName);
    div.appendChild(logoutButton);
    return div;
}

const logout = () => {
    const logoutURI = new URL(`${baseUrl}/realms/${realm}/protocol/openid-connect/logout`);
    const id_token_hint = sessionStorage.getItem("id_token");
    const urlParams = {
        client_id,
        post_logout_redirect_uri: redirect_uri,
        id_token_hint,
    };
    for(const key of Object.keys(urlParams)){
        logoutURI.searchParams.append(key, urlParams[key]);
    }
    sessionStorage.clear();
    window.location.href = logoutURI;
}

window.addEventListener("load", ()=>{
    const token = sessionStorage.getItem("token");
    if(token!==null){
        const __rootElement = document.querySelector("#root");
        const __content = generateUserProfile();
        __rootElement.appendChild(__content);
        return;
    }
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if(code){
        getToken(code);
        return;
    }
    redirectToKeycloak();
});