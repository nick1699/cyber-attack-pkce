export const displayUserProfile = async (authManager) => {
    const accessTokenClaims = await authManager.getAccessTokenClaims();
    if (!accessTokenClaims) return;

    createWelcomeMessage(accessTokenClaims.given_name);
    addLogoutEvent(() => authManager.logout());
};

export const displaySearchQuery = ()=> {
    const queryParams = new URLSearchParams(window.location.search);
    const searchQuery = queryParams.get('search');
    if (searchQuery) {
        // Fix für XSS mit .textContent
        document.getElementById('searchQuery').innerHTML = searchQuery;
    }
}

const createWelcomeMessage = (givenName) => {
    const welcomeSpan = document.querySelector("#givenName");
    welcomeSpan.innerHTML = givenName;
}

const addLogoutEvent = (onLogout) => {
    const logoutButton = document.querySelector("#logoutButton");
    logoutButton.addEventListener("click", onLogout);
};