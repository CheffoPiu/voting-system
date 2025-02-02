export class VoteDTO {
    userId: string;
    candidateId: string;

    constructor(userId: string, option: string) {
        this.userId = userId;
        this.candidateId = option;
    }
}
