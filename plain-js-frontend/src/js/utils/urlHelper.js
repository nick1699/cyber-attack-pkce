/**
 * Konstruiert eine URL aus einem Basis-URL und einem Objekt von Query-Parametern.
 * @param {string} baseUrl - Der Basis-URL.
 * @param {Object} params - Ein Objekt, das Query-Parameter enthält.
 * @returns {URL} - Eine URL mit angehängten Query-Parametern.
 */
export const constructUrl = (baseUrl, params = {}) => {
    const url = new URL(baseUrl);
    Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));
    return url;
}