export class AuthResponse {
    constructor(
        public person: PersonResponse,
        public token: string
    ) { }
}

export class AuthRequest {
    constructor(
        public Login: string,
        public Password: string
    ) { }
}

export class SignUpRequest {
    constructor(
        public Login: string,
        public Password: string
    ) { }
}

export class PersonResponse {
    constructor(
        public id: number,
        public login: string,
        public email: string
    ) { }
}

export class OperationResult<T> {
    constructor(
        public success: boolean,
        public errorCode: number,
        public message: string,
        public stackTrace: string,
        public result: T | undefined | null,
    ) { }
}