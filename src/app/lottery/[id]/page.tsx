'use client';

import {useEffect, useState} from 'react';
import {useParams} from 'next/navigation';
import {useAccount} from 'wagmi';
import {getLotteryById} from '@/api/lotteryApi';
import {Lottery} from '@/types/types';
import {BuyTicketButton} from '@/components/BuyTicketButton';
import {LaunchLotteryButton} from '@/components/LaunchLotteryButton';
import {useToast} from "@/components/ui/toast";
import {formatEther} from "viem";

export default function LotteryPage() {
    const {id} = useParams();
    const {address, isConnected} = useAccount();
    const [lottery, setLottery] = useState<Lottery | null>(null);
    const [totalTickets, setTotalTickets] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const {showToast} = useToast();

    const canLaunchLottery = lottery &&
        !lottery.winnerAddress &&
        isConnected &&
        lottery.owner === address &&
        new Date(lottery.endDate) <= new Date() &&
        totalTickets > 0;

    useEffect(() => {
        const fetchLottery = async () => {
            if (!id) return;

            setLoading(true);
            setError(null);

            try {
                const lotteryId = Array.isArray(id) ? id[0] : id;
                const response = await getLotteryById(lotteryId);
                setLottery(response.lottery);
                setTotalTickets(response.totalTickets);
            } catch (error) {
                console.error('Error fetching lottery:', error);
                setError('Failed to load lottery information');
                showToast({
                    title: "Error",
                    description: "Failed to load lottery information. Please try again.",
                    duration: 5000,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchLottery().then();
    }, [id]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 flex justify-center items-center">
                <div className="text-lg">Loading lottery information...</div>
            </div>
        );
    }

    if (error || !lottery) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center text-red-500">
                    {error || 'Lottery not found'}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {lottery.winnerAddress && (
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-green-500">
                        Winner: {lottery.winnerAddress}
                    </h2>
                </div>
            )}

            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h1 className="text-3xl font-bold mb-6">{lottery.description}</h1>
                <div className="space-y-4">
                    <p className="flex justify-between">
                        <span className="font-medium">Price:</span>
                        <span>{formatEther(BigInt(lottery.ticketPrice))} ETH</span>
                    </p>
                    <p className="flex justify-between">
                        <span className="font-medium">End Date:</span>
                        <span>{new Date(lottery.endDate).toLocaleDateString()}</span>
                    </p>
                    <p className="flex justify-between">
                        <span className="font-medium">Status:</span>
                        <span className={lottery.winnerAddress ? "text-red-500" : "text-green-500"}>
                            {lottery.winnerAddress ? "Ended" : "Active"}
                        </span>
                    </p>
                    <p className="flex justify-between">
                        <span className="font-medium">Tickets purchased:</span>
                        <span>{totalTickets}</span>
                    </p>

                    {!lottery.winnerAddress && isConnected && (
                        <div className="mt-6 space-y-4">
                            <BuyTicketButton
                                lotteryId={lottery.id}
                                ticketPrice={Number(lottery.ticketPrice)}
                                userAddress={address!}
                            />

                            {canLaunchLottery && (
                                <LaunchLotteryButton
                                    lotteryId={lottery.id}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}