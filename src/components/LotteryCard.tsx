import {Card, CardContent, CardFooter, CardHeader} from '@/components/ui/card';
import Link from 'next/link';
import {formatEther} from 'viem';
import {Lottery} from "@/types/types";

export const LotteryCard = ({lottery}: { lottery: Lottery }) => {
    return (
        <Link href={`/lottery/${lottery.id}`}>
            <Card className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <CardHeader>
                    <h3 className="text-lg font-semibold">{lottery.description}</h3>
                </CardHeader>
                <CardContent>
                    <p>Price: {formatEther(BigInt(lottery.ticketPrice))} ETH</p>
                    <p>Ends: {new Date(lottery.endDate).toLocaleDateString()}</p>
                </CardContent>
                <CardFooter>
                    {lottery.winnerAddress ?
                        <span className="text-green-500">Winner Selected!</span> :
                        <span className="text-blue-500">Active</span>
                    }
                </CardFooter>
            </Card>
        </Link>
    );
};