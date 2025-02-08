'use client';

import {useEffect, useState} from 'react';
import {getLotteries} from '@/api/lotteryApi';
import {Lottery} from '@/types/types';
import {LotteryCard} from "@/components/LotteryCard";
import {LotteryFilter} from "@/components/LotteryFilter";

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
                                <LotteryCard key={lottery.id} lottery={lottery}/>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}