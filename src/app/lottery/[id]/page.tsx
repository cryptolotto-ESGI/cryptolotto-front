'use client';

import {useEffect, useState} from 'react';
import {useParams} from 'next/navigation';
import {useAccount} from 'wagmi';
import {getLotteryById} from '@/api/lotteryApi';
import {Lottery} from '@/types/types';
import {BuyTicketButton} from '@/components/BuyTicketButton';
import {formatEther} from "viem";

export default function LotteryPage() {
    const {id} = useParams();
    const {address, isConnected} = useAccount();
    const [lottery, setLottery] = useState<Lottery | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLottery = async () => {
            try {
                const data = await getLotteryById(id as string);
                setLottery(data);
            } catch (error) {
                console.error('Error fetching lottery:', error);
            }
            setLoading(false);
        };

        fetchLottery();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!lottery) return <div>Lottery not found</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            {lottery.winnerAddress ? (
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-green-500">
                        Congratulations to {lottery.winnerAddress}!
                    </h2>
                </div>
            ) : null}

            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h1 className="text-3xl font-bold mb-4">{lottery.description}</h1>
                <div className="space-y-4">
                    <p>Price: {formatEther(BigInt(lottery.ticketPrice))} ETH</p>
                    <p>End Date: {new Date(lottery.endDate).toLocaleDateString()}</p>

                    {!lottery.winnerAddress && isConnected && (
                        <BuyTicketButton
                            lotteryId={lottery.id}
                            ticketPrice={lottery.ticketPrice}
                            userAddress={address!}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}