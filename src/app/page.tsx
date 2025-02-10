'use client';

import {useEffect, useState} from 'react';
import {getLotteries} from '@/api/lotteryApi';
import {Lottery} from '@/types/types';
import {LotteryCard} from "@/components/LotteryCard";
import {LotteryFilter} from "@/components/LotteryFilter";
import {CreateLotteryModal} from "@/components/CreateLotteryModal";
import {Button} from "@/components/ui/button";
import {useAccount, useConnect, useDisconnect} from "wagmi";
import {useToast} from "@/components/ui/toast";

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}

export default function Home() {
    const [lotteries, setLotteries] = useState<Lottery[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearch = useDebounce(searchQuery, 500);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const account = useAccount();
    const {connectors, connect, status, error} = useConnect()
    const {disconnect} = useDisconnect();
    const {showToast} = useToast();

    const handleCreateLotteryClick = () => {
        if (account.status !== 'connected') {
            showToast({
                title: "Connect Wallet",
                description: "Please connect your wallet to create a lottery",
                duration: 5000,
            });
            return;
        }
        setIsModalOpen(true);
    };

    const fetchLotteries = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams();
            if (debouncedSearch) {
                queryParams.append('description', debouncedSearch);
            }
            if (activeFilter !== undefined) {
                queryParams.append('active', activeFilter.toString());
            }

            const data = await getLotteries(queryParams.toString());
            setLotteries(data);
        } catch (error) {
            console.error('Error fetching lotteries:', error);
            showToast({
                title: "Error",
                description: "Failed to fetch lotteries.",
                duration: 5000,
            });
            setLotteries([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchLotteries().then();
    }, [activeFilter, debouncedSearch]);

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Take your chance !</h1>

            <div className="mb-4">
                <h2 className="text-lg font-semibold">Wallet Connection</h2>
                {account.status === 'connected' ? (
                    <div className="flex items-center gap-4">
                        <span>Connected as {account.address}</span>
                        <Button
                            onClick={() => disconnect()}
                            className="px-3 py-1 text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md shadow-md">
                            Disconnect
                        </Button>

                    </div>
                ) : (
                    <div className="flex gap-2">
                        {connectors.map((connector) => (
                            <Button key={connector.uid} onClick={() => connect({connector})}>
                                Connect with {connector.name}
                            </Button>
                        ))}
                    </div>
                )}
                {error && <div className="text-red-500">{error.message}</div>}
            </div>

            <Button onClick={handleCreateLotteryClick} className="mb-4">
                Create Lottery
            </Button>

            <LotteryFilter
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
            />

            {loading ? (
                <div className="flex justify-center items-center min-h-[200px]">
                    <div className="text-lg text-muted-foreground">Loading...</div>
                </div>
            ) : (
                <div>
                    {lotteries.length === 0 ? (
                        <div className="flex justify-center items-center min-h-[200px]">
                            <div className="text-lg text-muted-foreground">
                                No lotteries found, create one!
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {lotteries.map((lottery) => (
                                <LotteryCard key={lottery.blockchainId} lottery={lottery}/>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <CreateLotteryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}