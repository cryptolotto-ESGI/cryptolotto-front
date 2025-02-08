'use client';

import {useEffect, useState} from 'react';
import {useAccount} from 'wagmi';
import {getUserLotteries} from '@/api/lotteryApi';
import {Card} from "@/components/ui/card";
import {Lottery} from '@/types/types';

export default function MyLotteries() {
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
                setLotteries([]);
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
        <div className="w-full max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">My Lotteries</h1>

            {loading ? (
                <div className="flex justify-center items-center min-h-[200px]">
                    <div className="text-lg text-muted-foreground">Loading...</div>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {lotteries.map((lottery) => (
                        <Card key={lottery.id} className="hover:shadow-lg transition-shadow">
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}