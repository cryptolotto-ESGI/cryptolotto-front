'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';

export function Navigation() {
    const pathname = usePathname();

    return (
        <nav className="bg-card border-b mb-6">
            <div className="max-w-4xl mx-auto px-4">
                <div className="flex h-16 items-center">
                    <div className="mr-8">
                        <Link
                            href="/"
                            className="text-xl font-bold text-primary"
                        >
                            CryptoLotto
                        </Link>
                    </div>

                    <div className="flex space-x-4">
                        <Link
                            href="/"
                            className={`px-3 py-2 text-sm font-medium rounded-md ${
                                pathname === '/'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:bg-secondary'
                            }`}
                        >
                            Browse Lotteries
                        </Link>
                        <Link
                            href="/my-lotteries"
                            className={`px-3 py-2 text-sm font-medium rounded-md ${
                                pathname === '/my-lotteries'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:bg-secondary'
                            }`}
                        >
                            My Lotteries
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}