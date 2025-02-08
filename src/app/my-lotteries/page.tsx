'use client';

import {useEffect, useState} from 'react';
import {useAccount} from 'wagmi';
import {getUserLotteries} from '@/api/lotteryApi';
import {LotteryCard} from '@/components/LotteryCard';
import {Lottery} from '@/types/types';

export default function MyLotteriesPage() {
    const {address, isConnected} = useAccount();
    const [lotteries, setLotteries] = useState<Lottery[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserLotteries = async () => {
            if (!isConnected || !address) return;

            try {
                const data = await getUserLotteries(address);
                setLotteries(data);
            } catch (error) {
                console.error('Error fetching user lotteries:', error);
            }
            setLoading(false);
        };

        fetchUserLotteries();
    }, [address, isConnected]);

    if (!isConnected) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h2 className="text-2xl font-bold">Please connect your wallet to view your lotteries</h2>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">My Lotteries</h1>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {lotteries.map((lottery) => (
                        <LotteryCard key={lottery.id} lottery={lottery}/>
                    ))}
                </div>
            )}
        </div>
    );
}