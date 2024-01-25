export class Message {
    constructor(
        public id: number,
        public senderId: number,
        public senderLogin: string,
        public recipientId: number,
        public content: string,
        public sentAt: Date,
        public isCheck: boolean) { }
}
export class GroupedMessagesByLogin {
    constructor(
        public senderLogin: string,
        public messages: Message[]
    ) { }
}
export class GroupedMessages {
    constructor(
        public sentAt: Date,
        public messages: Message[]
    ) { }
}

export class SendMessageRequest {
    constructor(
        public personId: string,
        public senderId: number,
        public recipientId: number,
        public content: string,
        public isNewDialog: boolean
    ) { }
}

export class GetMessagesRequest {
    constructor(
        public senderId: number,
        public recipientId: number,
    ) { }
}

export class Dialog {
    constructor(
        public id: number,
        public name: string,
        public lastMessage: string,
        public isCheck: boolean,
        public dateTime: Date,
        public countUnreadMessages: number,
        public isGroup: boolean,
        public countMembers: number,
        public creatorLogin: string
    ) { }
}