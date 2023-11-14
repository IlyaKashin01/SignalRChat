export class GroupRequest {
    constructor(
        public Name: string,
        public CreatorId: number
    ) { }
}

export class GroupMessageDto {
    constructor(
        public GroupId: number,
        public SenderId: number,
        public Content: string,
    ) { }
}

export class MemberRequest {
    constructor(
        public GroupId: number,
        public AddedByPerson: number
    ) { }
}

export class GroupMessage {
    constructor(
        public groupId: number,
        public senderId: number,
        public content: string,
        public sentAt: Date
    ) { }
}