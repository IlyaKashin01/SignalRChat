export class Message {
    constructor(
        public senderId: number,
        public recipientId: number,
        public content: string,
        public sentAt: Date,
        public isCheck: boolean) { }
}

export class SendMessageRequest {
    constructor(
        public senderId: number,
        public recipientId: number,
        public content: string,
        public isCheck: boolean
    ) { }
}

export class GetMessagesRequest {
    constructor(
        public senderId: number,
        public recipientId: number,
    ) { }
}