export class VoteDTO {
    userId: string;
    option: string;

    constructor(userId: string, option: string) {
        this.userId = userId;
        this.option = option;
    }
}
