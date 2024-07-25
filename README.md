# Cyber-Attack PKCE
This repository demonstrates how refresh tokens can be stolen using a cross-site scripting attack.

## Modules
* [Backend](modules/backend): Backend with bank account data
* [Pepared frontend](modules/prepared-frontend): Prepared frontend with XSS vulnerability
* [Malicious server](modules/malicious-server): Attacker server from which a malicious script is loaded
* [Fixed application](modules/fixed-application): Application where the vulnerability has been fixed by starting the authentication from the backend
