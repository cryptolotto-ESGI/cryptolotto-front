'use client';

import {useEffect, useState} from 'react';
import {useAccount, useConnect} from 'wagmi';
import {getUserLotteries} from '@/api/lotteryApi';
import {Lottery} from '@/types/types';
import {LotteryCard} from '@/components/LotteryCard';
import {Button} from '@/components/ui/button';
import {useToast} from '@/components/ui/toast';

export default function MyLotteries() {
    const [lotteries, setLotteries] = useState<Lottery[]>([]);
    const [loading, setLoading] = useState(true);
    const {address, isConnected} = useAccount();
    const {connectors, connect} = useConnect();
    const {showToast} = useToast();

    useEffect(() => {
        let mounted = true;

        const fetchUserLotteries = async () => {
            if (!address) {
                if (mounted) {
                    setLoading(false);
                }
                return;
            }

            if (mounted) {
                setLoading(true);
            }

            try {
                const userLotteries = await getUserLotteries(address);
                if (mounted) {
                    setLotteries(userLotteries);
                }
            } catch (error) {
                console.error('Error fetching user lotteries:', error);
                if (mounted) {
                    showToast({
                        title: "Error",
                        description: "Failed to fetch your lotteries. Please try again.",
                        duration: 5000,
                    });
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetchUserLotteries();

        return () => {
            mounted = false;
        };
    }, [address]); // On ne met que address comme dépendance

    if (!isConnected) {
        return (
            <div className="w-full max-w-4xl mx-auto p-4">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-bold mb-6">Connect Your Wallet</h1>
                    <p className="text-muted-foreground mb-4">
                        Please connect your wallet to see your lotteries
                    </p>
                    <div className="flex justify-center gap-2">
                        {connectors.map((connector) => (
                            <Button
                                key={connector.uid}
                                onClick={() => connect({connector})}
                            >
                                Connect with {connector.name}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">My Lotteries</h1>

            {loading ? (
                <div className="flex justify-center items-center min-h-[200px]">
                    <div className="text-lg text-muted-foreground">Loading your lotteries...</div>
                </div>
            ) : (
                <div>
                    {lotteries.length === 0 ? (
                        <div className="text-center space-y-4">
                            <p className="text-lg text-muted-foreground">
                                You haven't participated in any lotteries yet.
                            </p>
                            <Button onClick={() => window.location.href = '/'}>
                                Browse Available Lotteries
                            </Button>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {lotteries.map((lottery) => (
                                <LotteryCard key={lottery.id} lottery={lottery}/>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}