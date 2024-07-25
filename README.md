# Cyber-Attack PKCE
This repository demonstrates how refresh tokens can be stolen using a cross-site scripting attack.

## Disclaimer

This repository is intended for educational purposes only. The code and techniques demonstrated here are designed to illustrate the concept of refresh token hijacking. It is not intended for use in production environments or on systems you do not own or have explicit permission to test.

By using this code, you agree to the following terms:

1. You will not use this code for any malicious or illegal activities.
2. You will not use this code to compromise the security of any system without explicit permission from the system's owner.
3. The authors of this repository are not responsible for any damage caused by the use or misuse of this code.
4. This code is provided "as is" without warranty of any kind, express or implied. Use it at your own risk.

## Modules
* [Backend](modules/backend): Backend with bank account data
* [Pepared frontend](modules/prepared-frontend): Prepared frontend with XSS vulnerability
* [Malicious server](modules/malicious-server): Attacker server from which a malicious script is loaded
* [Fixed application](modules/fixed-application): Application where the vulnerability has been fixed by starting the authentication from the backend
