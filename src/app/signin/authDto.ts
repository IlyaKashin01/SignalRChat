export class AuthResponse {
    constructor(public person: PersonResponse, public token: string) { }
}

export class PersonResponse {
    constructor(public id: number, public login: string, public email: string) { }
}

export class AuthRequest {
    constructor(public Login: string, public Password: string) { }
}