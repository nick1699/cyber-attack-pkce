export class AuthData {
    private _client_id: string;
    private _email: string;
    private _email_verified: boolean;
    private _family_name: string;
    private _given_name: string;
    private _iss: string;
    private _name: string;
    private _preferred_username: string;
    private _scope: string;
    private _sub: string;
    private _username: string;

    constructor(data: any) {
        this._client_id = data.client_id;
        this._email = data.email;
        this._email_verified = data.email_verified;
        this._family_name = data.family_name;
        this._given_name = data.given_name;
        this._iss = data.iss;
        this._name = data.name;
        this._preferred_username = data.preferred_username;
        this._scope = data.scope;
        this._sub = data.sub;
        this._username = data.username;
    }

    get client_id(): string {
        return this._client_id;
    }

    get email(): string {
        return this._email;
    }

    get email_verified(): boolean {
        return this._email_verified;
    }

    get family_name(): string {
        return this._family_name;
    }

    get given_name(): string {
        return this._given_name;
    }

    get iss(): string {
        return this._iss;
    }

    get name(): string {
        return this._name;
    }

    get preferred_username(): string {
        return this._preferred_username;
    }

    get scope(): string {
        return this._scope;
    }

    get sub(): string {
        return this._sub;
    }

    get username(): string {
        return this._username;
    }
}