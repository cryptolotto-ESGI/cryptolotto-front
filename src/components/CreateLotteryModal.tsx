'use client';

import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import React, {useCallback, useEffect, useState} from "react";
import {useAccount, useConnect, useWriteContract} from 'wagmi';
import {useToast} from "@/components/ui/toast";
import {parseGwei} from "viem";

const LOTTERY_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS as `0x${string}` || "0x0000000000000000000000000000000000000000";

const LOTTERY_ABI: readonly unknown[] =
    process.env.NEXT_PUBLIC_LOTTERY_ABI
        ? JSON.parse(process.env.NEXT_PUBLIC_LOTTERY_ABI)
        : [
            {
                inputs: [
                    {name: "description", type: "string"},
                    {name: "ticketPrice", type: "uint256"},
                    {name: "endDate", type: "uint256"}
                ],
                name: "createLottery",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function"
            }
        ];

interface CreateLotteryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLotteriesReload: () => void;
}

export function CreateLotteryModal({isOpen, onClose, onLotteriesReload}: CreateLotteryModalProps) {
    const [description, setDescription] = useState("");
    const [ticketPrice, setTicketPrice] = useState("");
    const [endDate, setEndDate] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isWaitingConfirmation, setIsWaitingConfirmation] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const {address, isConnected} = useAccount();
    const {connectors, connect} = useConnect();
    const {showToast} = useToast();
    const {
        writeContract,
        data: hash,
        error: writeError,
        isPending,
        reset: resetWrite
    } = useWriteContract();

    const resetForm = useCallback(() => {
        setDescription("");
        setTicketPrice("");
        setEndDate("");
        setError(null);
        setSuccessMessage(null);
        setIsWaitingConfirmation(false);
        resetWrite?.();
    }, [resetWrite]);

    useEffect(() => {
        if (hash) {
            console.log('Transaction submitted:', hash);
            setIsWaitingConfirmation(true);
            const checkTransaction = async () => {
                try {
                    const receipt = await fetch(`https://api-testnet.bscscan.com/api?module=transaction&action=gettxreceiptstatus&txhash=${hash}&apikey=XPFPIDN4RUG884F37AKXKMG6QMAZXIRB48`);
                    const data = await receipt.json();
                    console.log('BSCScan API response:', data);

                    if (data.status === "1" &&
                        data.message === "OK" &&
                        data.result &&
                        data.result.status === "1") {

                        setSuccessMessage("Your lottery has been created successfully!");
                        setIsWaitingConfirmation(false);
                        setError(null);

                        setTimeout(() => {
                            resetForm();
                            onClose();
                            onLotteriesReload();
                        }, 3000);
                        return;
                    }

                    // Si la transaction a échoué
                    if (data.status === "1" && data.result && data.result.status === "0") {
                        setError('Transaction failed on the blockchain');
                        setIsWaitingConfirmation(false);
                        return;
                    }

                } catch (error) {
                    console.error('Error checking transaction:', error);
                    setError('Error while checking transaction status');
                }
            };

            const interval = setInterval(checkTransaction, 1000);
            return () => clearInterval(interval);
        }
    }, [hash, showToast, resetForm, onClose]);

    useEffect(() => {
        if (writeError) {
            console.error('Write error:', writeError);
            if (writeError.message.includes('User rejected the request')) {
                setError('Transaction cancelled by user');
            } else {
                setError(writeError.message);
            }
            setIsWaitingConfirmation(false);
        }
    }, [writeError]);

    const handleClose = useCallback(() => {
        resetForm();
        onClose();
    }, [resetForm, onClose]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!isConnected) {
            showToast({
                title: "Connect Wallet",
                description: "Please connect your wallet before creating a lottery.",
                duration: 5000,
            });
            return;
        }

        if (!description || !endDate) {
            setError('Please fill description and end date');
            return;
        }

        try {
            const endDateTime = new Date(endDate);
            if (endDateTime <= new Date()) {
                setError('End date must be in the future');
                return;
            }
            const minLaunchDate = BigInt(Math.floor(endDateTime.getTime() / 1000));
            const ticketPriceInGwei = ticketPrice ? parseGwei(ticketPrice) : BigInt(0);

            console.log('Submitting transaction with params:', {
                address: LOTTERY_CONTRACT_ADDRESS,
                description,
                ticketPriceInGwei: ticketPriceInGwei.toString(),
                minLaunchDate: minLaunchDate.toString()
            });

            writeContract({
                address: LOTTERY_CONTRACT_ADDRESS,
                abi: LOTTERY_ABI,
                functionName: 'createLottery',
                args: [
                    minLaunchDate,
                    ticketPriceInGwei,
                    description
                ]
            });
        } catch (error: any) {
            console.error('Create lottery error:', error);
            setError(error.message || 'Failed to create lottery');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Lottery</DialogTitle>
                </DialogHeader>

                {!isConnected && (
                    <div className="mb-4">
                        <h3 className="text-md font-medium">Connect Wallet</h3>
                        {connectors.map((connector) => (
                            <Button
                                key={connector.uid}
                                onClick={() => connect({connector})}
                                className="mr-2"
                            >
                                Connect with {connector.name}
                            </Button>
                        ))}
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                        {successMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Input
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter lottery description"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Ticket Price (ETH)</label>
                        <Input
                            type="number"
                            step="0.000000000000000001"
                            min="0"
                            value={ticketPrice}
                            onChange={(e) => setTicketPrice(e.target.value)}
                            placeholder="0"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">End Date</label>
                        <Input
                            required
                            type="datetime-local"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            min={new Date().toISOString().slice(0, 16)}
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isPending || isWaitingConfirmation}
                    >
                        {isPending
                            ? "Awaiting Approval..."
                            : isWaitingConfirmation
                                ? "Waiting for Confirmation..."
                                : "Create Lottery"
                        }
                    </Button>
                    {isWaitingConfirmation && (
                        <div className="text-sm text-center text-gray-500">
                            Transaction submitted, waiting for confirmation...
                        </div>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    );
}