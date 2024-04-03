export const displayUserProfile = async (authManager) => {
    const accessTokenClaims = await authManager.getAccessTokenClaims();
    if (!accessTokenClaims) return;

    createWelcomeMessage(accessTokenClaims.given_name);
    addLogoutEvent(() => authManager.logout());
};

const createWelcomeMessage = (givenName) => {
    const welcomeSpan = document.querySelector("#givenName");
    welcomeSpan.innerHTML = givenName;
}

const addLogoutEvent = (onLogout) => {
    const logoutButton = document.querySelector("#logoutButton");
    logoutButton.addEventListener("click", onLogout);
};