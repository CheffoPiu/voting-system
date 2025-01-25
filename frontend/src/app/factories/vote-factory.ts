export interface VotingStrategy {
    getOptions(): string[];
}

export class PoliticalVoting implements VotingStrategy {
    getOptions(): string[] {
        return ['Candidato A', 'Candidato B', 'Candidato C'];
    }
}

export class EventVoting implements VotingStrategy {
    getOptions(): string[] {
        return ['Evento 1', 'Evento 2', 'Evento 3'];
    }
}

export class VoteFactory {
    static createVoting(type: string): VotingStrategy {
        if (type === 'political') {
            return new PoliticalVoting();
        } else if (type === 'event') {
            return new EventVoting();
        }
        throw new Error('Tipo de votación no soportado');
    }
}
