import {Lottery} from "@/types/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface LotteryResponse {
    lottery: Lottery;
    totalTickets: number;
}

export const getLotteries = async (queryString?: string) => {
    const response = await fetch(`${API_BASE_URL}/lotteries/description${queryString ? `?${queryString}` : ''}`);
    if (!response.ok) throw new Error('Failed to fetch lotteries');
    return response.json();
};

export const getLotteryById = async (id: string): Promise<LotteryResponse> => {
    const response = await fetch(`${API_BASE_URL}/lotteries/${id}`);
    if (!response.ok) throw new Error('Failed to fetch lottery');
    return response.json();
};

export const getUserLotteries = async (address: string): Promise<Lottery[]> => {
    const response = await fetch(`${API_BASE_URL}/lotteries/user/${address}`);
    return response.json();
};
