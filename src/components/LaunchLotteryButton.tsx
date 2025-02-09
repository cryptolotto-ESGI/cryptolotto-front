'use client';

import {useEffect} from 'react';
import {useWaitForTransactionReceipt, useWriteContract} from 'wagmi';
import {useToast} from '@/components/ui/toast';
import {Button} from '@/components/ui/button';

const LOTTERY_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS as `0x${string}` || "0x0000000000000000000000000000000000000000";

const LOTTERY_ABI = [
    {
        inputs: [
            {name: "lotteryId", type: "uint256"}
        ],
        name: "launchLottery",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    }
] as const;

interface LaunchLotteryButtonProps {
    lotteryId: string;
}

export function LaunchLotteryButton({lotteryId}: LaunchLotteryButtonProps) {
    const {showToast} = useToast();
    const {
        writeContract,
        data: hash,
        error: writeError,
        isPending
    } = useWriteContract();

    const {isLoading: isConfirming, isSuccess} = useWaitForTransactionReceipt({
        hash,
    });

    useEffect(() => {
        if (writeError) {
            showToast({
                title: "Error",
                description: writeError.message,
                duration: 5000,
            });
        }
    }, [writeError, showToast]);

    useEffect(() => {
        if (isSuccess) {
            showToast({
                title: "Success!",
                description: "The lottery has been launched and a winner has been selected!",
                duration: 5000,
            });
        }
    }, [isSuccess, showToast]);

    const handleLaunchLottery = async () => {
        try {
            writeContract({
                address: LOTTERY_CONTRACT_ADDRESS,
                abi: LOTTERY_ABI,
                functionName: 'launchLottery',
                args: [BigInt(lotteryId)]
            });
        } catch (error) {
            console.error('Error launching lottery:', error);
            showToast({
                title: "Error",
                description: "Failed to launch lottery. Please try again.",
                duration: 5000,
            });
        }
    };

    const isDisabled = isPending || isConfirming;

    return (
        <Button
            onClick={handleLaunchLottery}
            disabled={isDisabled}
            className="w-full bg-green-500 hover:bg-green-600"
        >
            {isDisabled ? (
                <span>
                    {isPending ? "Confirm in Wallet..." : "Processing..."}
                </span>
            ) : (
                "Launch Lottery!"
            )}
        </Button>
    );
}