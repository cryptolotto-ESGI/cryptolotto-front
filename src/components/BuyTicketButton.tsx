'use client';

import {useState} from 'react';
import {useSimulateContract, useWatchContractEvent, useWriteContract} from 'wagmi';
import {parseEther} from 'viem';
import {createTicket} from '@/api/lotteryApi';

// This is a placeholder - you'll need to replace it with your actual contract ABI and address
const LOTTERY_CONTRACT_ABI = ["/* ... */"];
const LOTTERY_CONTRACT_ADDRESS = '0x...';

export const BuyTicketButton = ({
                                    lotteryId,
                                    ticketPrice,
                                    userAddress
                                }: {
    lotteryId: string;
    ticketPrice: number;
    userAddress: string;
}) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const {writeContract, isPending, isSuccess} = useWriteContract();

    // Simulate the contract call to check for potential errors
    const {data: simulateData} = useSimulateContract({
        address: LOTTERY_CONTRACT_ADDRESS,
        abi: LOTTERY_CONTRACT_ABI,
        functionName: 'buyTicket',
        args: [lotteryId],
        value: parseEther(ticketPrice.toString()),
    });

    // Watch for successful transaction
    useWatchContractEvent({
        address: LOTTERY_CONTRACT_ADDRESS,
        abi: LOTTERY_CONTRACT_ABI,
        eventName: 'TicketPurchased',
        onLogs: async () => {
            try {
                await createTicket(lotteryId, userAddress);
            } catch (error) {
                console.error('Error creating ticket:', error);
            }
            setIsProcessing(false);
        },
    });

    const handleBuyTicket = async () => {
        setIsProcessing(true);
        try {
            if (!simulateData) {
                throw new Error("Simulation data is not available.");
            }
            writeContract(simulateData.request);
        } catch (error) {
            console.error('Error buying ticket:', error);
            setIsProcessing(false);
        }
    };


    const isDisabled = isProcessing || isPending;

    return (
        <button
            onClick={handleBuyTicket}
            disabled={isDisabled}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
            {isDisabled ? 'Processing...' : 'Buy Ticket'}
        </button>
    );
};