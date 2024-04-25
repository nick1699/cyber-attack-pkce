export const displayLoggedInContent = async (authManager) => {
    const accessTokenClaims = await authManager.getAccessTokenClaims();
    if (!accessTokenClaims) return;

    toggleById("landing-page", false);
    toggleById("login-button", false);

    createWelcomeMessage(accessTokenClaims.given_name);
    toggleById("notification-button", true);
    toggleById("profile-button", true);
    addLogoutEvent(() => authManager.logout());
    setupDropdownToggle();

    bankAccountRequest(authManager);
    toggleById("bank-accounts", true);
};

export const displayCityQuery = () => {
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
        element.classList.remove('hidden');
    } else {
        element.classList.add('hidden');
    }
};

const addLogoutEvent = (onLogout) => {
    const logoutButton = document.querySelector("#logoutButton");
    logoutButton.addEventListener("click", onLogout);
};

const setupDropdownToggle = () => {
    document.getElementById('user-menu-button').addEventListener('click', function () {
        const menu = document.querySelector('.menu');
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        menu.classList.toggle('hidden');
    });
};

const bankAccountRequest = (authManager) => {
    fetch('http://localhost:3000/api/accounts', {
        method: 'GET', // Optional, da GET die Standardmethode ist
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authManager.getAccessToken()}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const accountsContainer = document.getElementById('bank-accounts');
        const list = accountsContainer.querySelector('ul');
        list.innerHTML = '';

        data.forEach(account => {
            const item = `
                    <li class="py-3">
                        <div class="flex items-center">
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-bold text-gray-900 truncate dark:text-white">${account.type}</p>
                                <p class="text-sm text-gray-500 truncate dark:text-gray-400">${account.iban}</p>
                            </div>
                            <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                ${account.balance} €
                            </div>
                        </div>
                    </li>
                `;
            list.innerHTML += item;
        });

        accountsContainer.classList.remove('hidden');
    });
};
