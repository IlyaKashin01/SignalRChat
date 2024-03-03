export class Dialog {
    constructor(
        public id: number,
        public name: string,
        public lastMessage: string,
        public isCheck: boolean,
        public sentAt: Date,
        public countUnreadMessages: number,
        public senderLogin: string,
        public isGroup: boolean,
        public countMembers: number,
        public creatorLogin: string
    ) { }
}

export class LastMessage {
    constructor(
        public dialogId: number,
        public message: string,
        public isCheck: boolean,
        public sentAt: Date,
        public senderLogin: string,
    ){}
}

export class Notification {
    constructor(
        public title: string,
        public message: string
    ){}
}