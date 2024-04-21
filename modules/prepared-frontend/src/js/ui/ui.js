export const displayUserProfile = async (authManager) => {
    const accessTokenClaims = await authManager.getAccessTokenClaims();
    if (!accessTokenClaims) return;

    createWelcomeMessage(accessTokenClaims.given_name);
    addLogoutEvent(() => authManager.logout());
    setupDropdownToggle();
};

export const displayCityQuery = ()=> {
    debugger
    const queryParams = new URLSearchParams(window.location.search);
    const city = queryParams.get('city');
    if (city) {
        // Fix für XSS mit .textContent
        document.getElementById('city').innerHTML = city;
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


const setupDropdownToggle = () => {
    const button = document.getElementById('user-menu-button');
    const menu = document.querySelector('[aria-labelledby="user-menu-button"]');

    button.addEventListener('click', () => {
        const isExpanded = button.getAttribute('aria-expanded') === 'true';

        button.setAttribute('aria-expanded', !isExpanded);
        if (isExpanded) {
            // Beginnen der Ausblend-Animation
            menu.style.transition = 'transform ease-in 75ms, opacity ease-in 75ms';
            menu.style.transform = 'scale(0.95)';
            menu.style.opacity = '0';
            setTimeout(() => menu.classList.add('hidden'), 75);
        } else {
            // Beginnen der Einblend-Animation
            menu.classList.remove('hidden');
            menu.style.transition = 'transform ease-out 100ms, opacity ease-out 100ms';
            menu.style.transform = 'scale(1)';
            menu.style.opacity = '1';
        }
    });
};