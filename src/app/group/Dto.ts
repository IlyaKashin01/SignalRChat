export class GroupRequest {
    constructor(
        public Name: string,
        public PersonId: number
    ) { }
}

export class GroupMessageDto {
    constructor(
        public groupId: number,
        public senderId: number,
        public content: string,
    ) { }
}
export class GroupedMessagesInGroup {
    constructor(
        public sentAt: Date,
        public messages: GroupMessage[]
    ) { }
}
export class MemberRequest {
    constructor(
        public GroupId: number,
        public PersonId: number,
        public AddedByPerson: number,
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