export const displayUserProfile = async (authManager) => {
    const accessTokenClaims = await authManager.getAccessTokenClaims();
    if (!accessTokenClaims) return;
    const rootElement = document.querySelector("#root");
    const profileElement = createUserProfileElement(accessTokenClaims, () => authManager.logout());
    rootElement.appendChild(profileElement);
};

const createUserProfileElement = (accessTokenClaims, onLogout) => {
    const div = document.createElement("div");
    const userName = document.createElement("label");
    userName.innerText = `--------${accessTokenClaims.given_name} ${accessTokenClaims.family_name} (${accessTokenClaims.email})--------`;
    const logoutButton = document.createElement("button");
    logoutButton.innerText = "Logout";
    logoutButton.addEventListener("click", onLogout);
    div.append(userName, logoutButton);
    return div;
};