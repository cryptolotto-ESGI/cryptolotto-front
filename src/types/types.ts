export interface Lottery {
    id: string;
    description: string;
    ticketPrice: number;
    winnerAddress: string;
    endDate: Date;
}

export interface Ticket {
    id: string;
    lottery: Lottery;
    buyer: string;
    purchaseDate: Date;
}