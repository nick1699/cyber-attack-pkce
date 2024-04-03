import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import qs from 'qs';
import {AuthData} from "../models/auth/auth-data.model";

let isIntrospectInProgress = false;
const tokenCache = new Map();

const CLIENT_ID = 'prepared-backend';
const CLIENT_SECRET = "1MZfc4udsERDpvhdZJX04uekepc0nSUV";
const TOKEN_INTROSPECT_URL = 'http://keycloak:8080/realms/cyber-attack/protocol/openid-connect/token/introspect';

async function introspectToken(token: string): Promise<any> {
    const authData = getCachedTokenIfValid(token);

    if (authData) {
        return authData;
    }

    return await requestAndCacheToken(token);
}

function getCachedTokenIfValid(token: string) {
    const cacheEntry = tokenCache.get(token);

    if (cacheEntry && Date.now() < cacheEntry.expiryDate) {
        return cacheEntry.authData;
    }

    return null;
}

async function requestAndCacheToken(token: string) {
    while (isIntrospectInProgress) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    try {
        isIntrospectInProgress = true;

        const data = qs.stringify({
            token,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
        });

        const response = await axios.post(TOKEN_INTROSPECT_URL, data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });

        if (response.status === 200 && response.data.active) {
            const expiresInMilliseconds = response.data.exp * 1000 - Date.now();
            const expiryDate = response.data.exp * 1000;
            const authData = new AuthData(response.data);

            tokenCache.set(token, { authData, expiryDate });

            setTimeout(() => {
                tokenCache.delete(token);
            }, expiresInMilliseconds);

            return authData;
        }

    } catch (error) {
        console.error('Token introspection request failed:', error);
    } finally {
        isIntrospectInProgress = false;
    }

    return null;
}

export const requiresAuth = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).send('Authorization header missing');
        }

        const match = authHeader.match(/^Bearer (.+)$/);
        if (!match) {
            return res.status(401).send('Invalid Authorization header format. Use "Bearer <token>"');
        }

        const token = match[1];
        const authData = await introspectToken(token);

        if (!authData) {
            return res.status(401).send('Invalid token');
        }

        req.auth = authData;
        next();
    };
};