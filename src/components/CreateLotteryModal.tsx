'use client';

import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import React, {useEffect, useState} from "react";
import {useAccount, useConnect, useWaitForTransactionReceipt, useWriteContract} from 'wagmi';
import {parseEther} from "viem";
import {useToast} from "@/components/ui/toast";

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
}

export function CreateLotteryModal({isOpen, onClose}: CreateLotteryModalProps) {
    const [description, setDescription] = useState("");
    const [ticketPrice, setTicketPrice] = useState("");
    const [endDate, setEndDate] = useState("");

    const {address, isConnected} = useAccount();
    const {connectors, connect} = useConnect();
    const {showToast} = useToast();
    const {
        writeContract,
        data: hash,
        error: writeError,
        isPending
    } = useWriteContract();
    const {isSuccess, isError} = useWaitForTransactionReceipt(
        hash ? {hash} : undefined
    );

    useEffect(() => {
        if (isSuccess) {
            showToast({
                title: "Lottery Created",
                description: "Your lottery has been created successfully!",
                duration: 5000,
            });
            onClose();
            resetForm();
        }

        if (isError) {
            showToast({
                title: "Transaction Failed",
                description: "Failed to create lottery. Please try again.",
                duration: 5000,
            });
        }
    }, [isSuccess, isError]);


    const resetForm = () => {
        setDescription("");
        setTicketPrice("");
        setEndDate("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isConnected) {
            showToast({
                title: "Connect Wallet",
                description: "Please connect your wallet before creating a lottery.",
                duration: 5000,
            });
            return;
        }

        if (!description || !ticketPrice || !endDate) {
            showToast({
                title: "Invalid Input",
                description: "Please fill all fields correctly.",
                duration: 5000,
            });
            return;
        }

        try {
            const result: any = writeContract({
                address: LOTTERY_CONTRACT_ADDRESS,
                abi: LOTTERY_ABI,
                functionName: 'createLottery',
                args: [
                    description,
                    parseEther(ticketPrice || "0"),
                    BigInt(Math.floor(new Date(endDate).getTime() / 1000))
                ]
            });

            if (result && result.hash) {
                showToast({
                    title: "Transaction Submitted",
                    description: "Waiting for confirmation...",
                    duration: 5000,
                });
            }
        } catch (error) {
            showToast({
                title: "Transaction Failed",
                description: "Error creating lottery. Please check your inputs.",
                duration: 5000,
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Lottery</DialogTitle>
                </DialogHeader>

                {/* Wallet Connection Section */}
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

                {/* Form Section */}
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
                            required
                            type="number"
                            step="0.000000000000000001"
                            min="0"
                            value={ticketPrice}
                            onChange={(e) => setTicketPrice(e.target.value)}
                            placeholder="0.01"
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
                    {writeError && (
                        <div className="text-red-500 text-sm">
                            {writeError.message}
                        </div>
                    )}
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isPending}
                    >
                        {isPending ? "Creating..." : "Create Lottery"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}