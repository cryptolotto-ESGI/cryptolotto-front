'use client';

import {useEffect, useState} from 'react';
import {useWaitForTransactionReceipt, useWriteContract} from 'wagmi';
import {useToast} from '@/components/ui/toast';
import {formatEther} from 'viem';

const LOTTERY_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS as `0x${string}` || "0x0000000000000000000000000000000000000000";

const LOTTERY_ABI = [
    {
        inputs: [
            {name: "lotteryId", type: "string"}
        ],
        name: "buyTicket",
        outputs: [],
        stateMutability: "payable",
        type: "function"
    }
] as const;

interface BuyTicketButtonProps {
    lotteryId: string;
    ticketPrice: number;
    userAddress: string;
}

export const BuyTicketButton = ({
                                    lotteryId,
                                    ticketPrice,
                                    userAddress
                                }: BuyTicketButtonProps) => {
    const {showToast} = useToast();
    const [isProcessing, setIsProcessing] = useState(false);

    const {writeContract, data: hash, error: writeError, isPending} = useWriteContract();

    const {isLoading: isConfirming, isSuccess} = useWaitForTransactionReceipt({
        hash,
    });

    useEffect(() => {
        if (isSuccess) {
            showToast({
                title: "Success!",
                description: "You have successfully bought a ticket!",
                duration: 5000,
            });
            setIsProcessing(false);
        }
    }, [isSuccess, showToast]);

    useEffect(() => {
        if (writeError) {
            showToast({
                title: "Error",
                description: writeError.message,
                duration: 5000,
            });
            setIsProcessing(false);
        }
    }, [writeError, showToast]);

    const handleBuyTicket = async () => {
        try {
            setIsProcessing(true);
            writeContract({
                address: LOTTERY_CONTRACT_ADDRESS,
                abi: LOTTERY_ABI,
                functionName: 'buyTicket',
                args: [lotteryId],
                value: BigInt(ticketPrice)
            });
        } catch (error) {
            console.error('Error buying ticket:', error);
            showToast({
                title: "Error",
                description: "Failed to buy ticket. Please try again.",
                duration: 5000,
            });
            setIsProcessing(false);
        }
    };

    const isDisabled = isProcessing || isConfirming || isPending;
    const priceInEth = formatEther(BigInt(ticketPrice));

    return (
        <button
            onClick={handleBuyTicket}
            disabled={isDisabled}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
            {isDisabled ? (
                <span className="flex items-center justify-center">
                    {isPending ? "Confirm in Wallet..." : "Processing..."}
                </span>
            ) : (
                <span>Buy Ticket for {priceInEth} ETH</span>
            )}
        </button>
    );
};