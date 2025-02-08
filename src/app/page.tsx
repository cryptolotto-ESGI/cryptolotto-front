'use client';

import {useEffect, useState} from 'react';
import {getLotteries} from '@/api/lotteryApi';
import {Lottery} from '@/types/types';
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {formatEther} from "viem";

export default function Home() {
    const [lotteries, setLotteries] = useState<Lottery[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);

    const fetchLotteries = async (active?: boolean) => {
        setLoading(true);
        try {
            const data = await getLotteries(active);
            setLotteries(data);
        } catch (error) {
            console.error('Error fetching lotteries:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchLotteries(activeFilter);
    }, [activeFilter]);

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">CryptoLotto</h1>

            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setActiveFilter(undefined)}
                    className={`px-4 py-2 rounded-md transition-colors ${
                        activeFilter === undefined
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                >
                    All
                </button>
                <button
                    onClick={() => setActiveFilter(true)}
                    className={`px-4 py-2 rounded-md transition-colors ${
                        activeFilter === true
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                >
                    Active
                </button>
                <button
                    onClick={() => setActiveFilter(false)}
                    className={`px-4 py-2 rounded-md transition-colors ${
                        activeFilter === false
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                >
                    Ended
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center min-h-[200px]">
                    <div className="text-lg text-muted-foreground">Loading...</div>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {lotteries.map((lottery) => (
                        <Card key={lottery.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <h3 className="text-xl font-semibold">{lottery.description}</h3>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <p className="flex justify-between">
                                        <span className="text-muted-foreground">Price:</span>
                                        <span className="font-medium">
                                            {formatEther(BigInt(lottery.ticketPrice))} ETH
                                        </span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span className="text-muted-foreground">Ends:</span>
                                        <span className="font-medium">
                                            {new Date(lottery.endDate).toLocaleDateString()}
                                        </span>
                                    </p>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <div className="w-full flex justify-end">
                                    {!lottery.winnerAddress ? (
                                        <span
                                            className="text-sm px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                                            Active
                                        </span>
                                    ) : (
                                        <span
                                            className="text-sm px-2 py-1 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                                            Winner Selected
                                        </span>
                                    )}
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}