export const displayUserProfile = async (authManager) => {
    const accessTokenClaims = await authManager.getAccessTokenClaims();
    if (!accessTokenClaims) return;

    createWelcomeMessage(accessTokenClaims.given_name);
    addLogoutEvent(() => authManager.logout());
    setupDropdownToggle();
};

export const displayCityQuery = ()=> {
    const queryParams = new URLSearchParams(window.location.search);
    const city = queryParams.get('city');
    if (city) {
        // Fix für XSS mit .textContent
        document.getElementById('city').innerHTML = city;
    }
}

const createWelcomeMessage = (givenName) => {
    const welcomeSpan = document.querySelector("#givenName");
    welcomeSpan.innerHTML = `, ${givenName}`;
}

const addLogoutEvent = (onLogout) => {
    const logoutButton = document.querySelector("#logoutButton");
    logoutButton.addEventListener("click", onLogout);
};

const setupDropdownToggle = () => {
    document.getElementById('user-menu-button').addEventListener('click', function() {
        const menu = document.querySelector('.menu');
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        menu.classList.toggle('hidden');
    });
};