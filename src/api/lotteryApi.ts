import {Lottery, Ticket} from "@/types/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const getLotteries = async (active?: boolean): Promise<Lottery[]> => {
    const url = active !== undefined
        ? `${API_BASE_URL}/lotteries/active?active=${active}`
        : `${API_BASE_URL}/lotteries`;
    const response = await fetch(url);
    return response.json();
};

export const getLotteryById = async (id: string): Promise<Lottery> => {
    const response = await fetch(`${API_BASE_URL}/lotteries/${id}`);
    return response.json();
};

export const getUserLotteries = async (address: string): Promise<Lottery[]> => {
    const response = await fetch(`${API_BASE_URL}/lotteries/user/${address}`);
    return response.json();
};

export const createTicket = async (lotteryId: string, buyer: string): Promise<Ticket> => {
    const response = await fetch(`${API_BASE_URL}/tickets`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({lotteryId, buyer})
    });
    return response.json();
};