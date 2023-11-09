export class Message {
    constructor(
        public senderId: number,
        public recipientId: number,
        public content: string,
        public sentAt: Date,
        public isCheck: boolean) { }
}