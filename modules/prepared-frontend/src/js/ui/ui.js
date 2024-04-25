export const displayLoggedInContent = async (authManager) => {
    const accessTokenClaims = await authManager.getAccessTokenClaims();
    if (!accessTokenClaims) return;

    toggleById("landing-page", false);
    toggleById("login-button", false);

    createWelcomeMessage(accessTokenClaims.given_name);
    toggleById("notification-button", true);
    toggleById("profile-button", true);
    toggleById("bank-accounts", true);
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

const toggleById = (id, display) => {
    const element = document.getElementById(id);

    if (display) {
        element.style.display = 'block';
    } else {
        element.style.display = 'none';
    }
};

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
