export class GroupRequest {
    constructor(
        public Name: string,
        public PersonId: number
    ) { }
}

export class GroupMessageRequest {
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
        public senderLogin: string,
        public content: string,
        public sentAt: Date,
        public isCheck: boolean
    ) { }
}

export class MemberResponse {
    constructor(
        public creatorLogin: string,
        public groupMembers: MemberInGroup[]
    ) { }
}

export class MemberInGroup {
    constructor(
        public id: number,
        public groupId: number,
        public personId: number,
        public memberLogin: string,
        public addedByPersonLogin: string,
        public addedDate: Date
    ) { }
}

export class LeaveGroupRequest {
    constructor(
        public groupId: number, 
        public personId: number,
        public personLogin: string, 
        public creatorLogin: string
    ){}
}