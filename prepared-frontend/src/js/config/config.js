export const config = {
    baseUrl: "http://localhost:8080",
    realm: "cyber-attack",
    clientId: "prepared-frontend",
    get redirectUri() {
        return `${window.location.protocol}//${window.location.host}/`;
    },
};