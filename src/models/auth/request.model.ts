import {AuthData} from "./auth-data.model";

declare global {
    namespace Express {
        export interface Request {
            auth?: AuthData;
        }
    }
}