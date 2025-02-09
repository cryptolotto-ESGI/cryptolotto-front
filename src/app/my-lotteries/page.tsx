'use client';

import {useEffect, useState} from 'react';
import {useAccount, useConnect} from 'wagmi';
import {getOwnerLotteries, getUserLotteries} from '@/api/lotteryApi';
import {Lottery} from '@/types/types';
import {LotteryCard} from '@/components/LotteryCard';
import {Button} from '@/components/ui/button';
import {useToast} from '@/components/ui/toast';

type TabType = 'created' | 'participated';

export default function MyLotteries() {
    const [activeTab, setActiveTab] = useState<TabType>('created');
    const [participatedLotteries, setParticipatedLotteries] = useState<Lottery[]>([]);
    const [createdLotteries, setCreatedLotteries] = useState<Lottery[]>([]);
    const [loadingParticipated, setLoadingParticipated] = useState(true);
    const [loadingCreated, setLoadingCreated] = useState(true);
    const {address, isConnected} = useAccount();
    const {connectors, connect} = useConnect();
    const {showToast} = useToast();

    useEffect(() => {
        let mounted = true;

        if (!address) {
            setLoadingParticipated(false);
            setLoadingCreated(false);
            return;
        }

        async function fetchParticipatedLotteries(userAddress: string) {
            try {
                const userLotteries = await getUserLotteries(userAddress);
                if (mounted) {
                    setParticipatedLotteries(userLotteries);
                }
            } catch (error) {
                console.error('Error fetching participated lotteries:', error);
                if (mounted) {
                    setParticipatedLotteries([]);
                }
            } finally {
                if (mounted) {
                    setLoadingParticipated(false);
                }
            }
        }

        async function fetchCreatedLotteries(userAddress: string) {
            try {
                const ownerLotteries = await getOwnerLotteries(userAddress);
                if (mounted) {
                    setCreatedLotteries(ownerLotteries);
                }
            } catch (error) {
                console.error('Error fetching created lotteries:', error);
                if (mounted) {
                    setCreatedLotteries([]);
                }
            } finally {
                if (mounted) {
                    setLoadingCreated(false);
                }
            }
        }

        setLoadingParticipated(true);
        setLoadingCreated(true);

        fetchParticipatedLotteries(address).then();
        fetchCreatedLotteries(address).then();

        return () => {
            mounted = false;
        };
    }, [address]);

    useEffect(() => {
        if (!loadingParticipated && participatedLotteries.length === 0) {
            showToast({
                title: "No Participations",
                description: "You haven't participated in any lotteries yet.",
                duration: 5000,
            });
        }
    }, [loadingParticipated, participatedLotteries.length]);

    useEffect(() => {
        if (!loadingCreated && createdLotteries.length === 0) {
            showToast({
                title: "No Created Lotteries",
                description: "You haven't created any lotteries yet.",
                duration: 5000,
            });
        }
    }, [loadingCreated, createdLotteries.length]);

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

    const renderLotteryGrid = (lotteries: Lottery[], loading: boolean, emptyMessage: string) => {
        if (loading) {
            return (
                <div className="flex justify-center items-center min-h-[200px]">
                    <div className="text-lg text-muted-foreground">Loading lotteries...</div>
                </div>
            );
        }

        if (lotteries.length === 0) {
            return (
                <div className="text-center space-y-4">
                    <p className="text-lg text-muted-foreground">{emptyMessage}</p>
                    <Button onClick={() => window.location.href = '/'}>
                        Browse Available Lotteries
                    </Button>
                </div>
            );
        }

        return (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {lotteries.map((lottery) => (
                    <LotteryCard key={lottery.id} lottery={lottery}/>
                ))}
            </div>
        );
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">My Lotteries</h1>

            <div className="mb-6">
                <div className="flex space-x-2 p-1 bg-gray-100 rounded-lg dark:bg-gray-800">
                    <button
                        className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                            activeTab === 'created'
                                ? 'bg-white dark:bg-gray-700 shadow-sm'
                                : 'hover:bg-white/50 dark:hover:bg-gray-700/50'
                        }`}
                        onClick={() => setActiveTab('created')}
                    >
                        Created Lotteries
                    </button>
                    <button
                        className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                            activeTab === 'participated'
                                ? 'bg-white dark:bg-gray-700 shadow-sm'
                                : 'hover:bg-white/50 dark:hover:bg-gray-700/50'
                        }`}
                        onClick={() => setActiveTab('participated')}
                    >
                        My Participations
                    </button>
                </div>
            </div>

            <div className="mt-6">
                {activeTab === 'created' ? (
                    renderLotteryGrid(
                        createdLotteries,
                        loadingCreated,
                        "You haven't created any lotteries yet."
                    )
                ) : (
                    renderLotteryGrid(
                        participatedLotteries,
                        loadingParticipated,
                        "You haven't participated in any lotteries yet."
                    )
                )}
            </div>
        </div>
    );
}