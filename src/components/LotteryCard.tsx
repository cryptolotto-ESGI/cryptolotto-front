import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {Lottery} from "@/types/types";
import {formatEther} from "viem";

interface LotteryCardProps {
    lottery: Lottery;
}

export function LotteryCard({lottery}: LotteryCardProps) {
    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <h3 className="text-xl font-semibold">{lottery.description}</h3>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <p className="flex justify-between">
                        <span className="text-muted-foreground">Price:</span>
                        <span className="font-medium">
                            {formatEther(lottery.ticketPrice)} ETH
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
                            className="text-sm px-2 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                            Inactive
                        </span>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
}