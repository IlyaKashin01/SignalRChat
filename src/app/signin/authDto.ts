export class AuthResponse {
    constructor(public person: PersonResponse, public token: string) { }
}

export class PersonResponse {
    constructor(public Id: number, public Login: string, public Email: string) { }
}

export class AuthRequest {
    constructor(public Login: string, public Password: string) { }
}