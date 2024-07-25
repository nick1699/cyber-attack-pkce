# Cyber-Attack PKCE
This repository demonstrates how refresh tokens can be stolen using a cross-site scripting attack.

## Modules
[Backend](modules/backend): Backend with bank account data
[Backend](modules/prepared-frontend): Prepared frontend with XSS vulnerability
[Backend](modules/malicious-server): Attacker server from which a malicious script is loaded
[Backend](modules/fixed-application): Application where the vulnerability has been fixed by starting the authentication from the backend
