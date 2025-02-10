export interface Lottery {
    id: string;
    blockchainId: string;
    description: string;
    ticketPrice: bigint;
    owner: string;
    winnerAddress: string;
    endDate: Date;
}

export interface Ticket {
    id: string;
    lottery: Lottery;
    buyer: string;
    purchaseDate: Date;
}