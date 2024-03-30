export const generateRandomState = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
});

export const decodeJWT = token => {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid JWT');
    return JSON.parse(window.atob(parts[1]));
};

export const isTokenValid = (token) => {
    if (!token) return false;
    const payload = decodeJWT(token);
    const now = Date.now() / 1000;
    return payload.exp > now;
};